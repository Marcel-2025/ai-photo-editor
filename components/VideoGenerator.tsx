import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageFile } from '../types';
import { useUser } from '../contexts/UserContext';
import { generateVideoWithGemini, fetchVideoFromUri, generatePromptSuggestionsForVideo } from '../services/geminiService';
import { ImageUploader } from './ImageUploader';
import { ImageDisplay } from './ImageDisplay';
import { Loader } from './Loader';
import { PremiumModal } from './PremiumModal';
import { PromptSuggestions } from './PromptSuggestions';
import { MagicWandIcon, TrashIcon, DownloadIcon, VideoIcon, AspectRatioIcon, ScreenResolutionIcon } from './IconComponents';

type AspectRatio = '16:9' | '9:16';
type Resolution = '720p' | '1080p';

export const VideoGenerator: React.FC = () => {
    const { t } = useTranslation();
    const { isPremium, credits, deductCredits, goPremium } = useUser();

    const VIDEO_ASPECT_RATIOS: { name: string, value: AspectRatio }[] = [
        { name: t('videoGenerator.ratios.landscape'), value: '16:9' },
        { name: t('videoGenerator.ratios.portrait'), value: '9:16' },
    ];

    const VIDEO_RESOLUTIONS: { name: string, value: Resolution }[] = [
        { name: t('videoGenerator.resolutions.p720'), value: '720p' },
        { name: t('videoGenerator.resolutions.p1080'), value: '1080p' },
    ];

    const LOADING_MESSAGES = [
        t('videoGenerator.loadingMessages.m1'),
        t('videoGenerator.loadingMessages.m2'),
        t('videoGenerator.loadingMessages.m3'),
        t('videoGenerator.loadingMessages.m4'),
        t('videoGenerator.loadingMessages.m5'),
        t('videoGenerator.loadingMessages.m6'),
    ];
    
    const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [resolution, setResolution] = useState<Resolution>('720p');
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [promptSuggestions, setPromptSuggestions] = useState<{ [key: string]: string[] }>({});
    const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
    
    const messageIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (sourceImage) {
            const getSuggestions = async () => {
                setIsSuggesting(true);
                setPromptSuggestions({});
                setError(null);
                try {
                    const suggestions = await generatePromptSuggestionsForVideo(sourceImage.file);
                    const translatedSuggestions = Object.keys(suggestions).reduce((acc, key) => {
                        const translatedKey = t(`imageGenerator.promptSuggestions.${key.replace(/\s/g, '').replace('&', 'And')}`, key);
                        acc[translatedKey] = suggestions[key];
                        return acc;
                    }, {} as {[key: string]: string[]});
                    setPromptSuggestions(translatedSuggestions);
                } catch (err) {
                    console.error("Failed to fetch prompt suggestions:", err);
                } finally {
                    setIsSuggesting(false);
                }
            };
            getSuggestions();
        }
    }, [sourceImage, t]);

    useEffect(() => {
        if (isLoading) {
            let messageIndex = 0;
            setLoadingMessage(LOADING_MESSAGES[messageIndex]);
            messageIntervalRef.current = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
                setLoadingMessage(LOADING_MESSAGES[messageIndex]);
            }, 5000);
        } else {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
                messageIntervalRef.current = null;
            }
        }
        return () => {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        };
    }, [isLoading, LOADING_MESSAGES]);

    const handleImageUpload = (file: File) => {
        setSourceImage({ file, previewUrl: URL.createObjectURL(file) });
        setGeneratedVideoUrl(null);
        setError(null);
        setPrompt('');
    };

    const handleGenerate = useCallback(async () => {
        if (!sourceImage || !prompt.trim()) {
            setError("Please upload an image and enter a prompt.");
            return;
        }
        if (!isPremium && credits < 100) {
            setError(`You need 100 credits to generate a video. You have ${credits}.`);
            setShowPremiumModal(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);

        try {
            if (!deductCredits(100)) {
                throw new Error("An unknown error occurred with credits.");
            }
            const videoUri = await generateVideoWithGemini(sourceImage.file, prompt.trim(), aspectRatio, resolution);
            setLoadingMessage(t('videoGenerator.loadingMessages.m7'));
            const videoBlob = await fetchVideoFromUri(videoUri);
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoUrl);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [sourceImage, prompt, aspectRatio, resolution, isPremium, credits, deductCredits, t]);
    
    const reset = () => {
        setSourceImage(null);
        setGeneratedVideoUrl(null);
        setError(null);
        setPrompt('');
        setPromptSuggestions({});
        setIsSuggesting(false);
    };

    const handleSuggestionSelect = (suggestion: string) => {
        setPrompt(prev => {
            const trimmedPrev = prev.trim();
            if (!trimmedPrev) return suggestion;
            if (trimmedPrev.endsWith(',') || trimmedPrev.endsWith('.')) return `${trimmedPrev} ${suggestion}`;
            return `${trimmedPrev}, ${suggestion}`;
        });
    };

    if (!sourceImage) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <ImageUploader onImageUpload={handleImageUpload} />
            </div>
        );
    }
    
    return (
        <>
        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8">
            {/* Aspect Ratio Controls */}
            <div className="lg:col-span-2 bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <AspectRatioIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t('videoGenerator.aspectRatio')}</h3>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {VIDEO_ASPECT_RATIOS.map((ratio) => (
                        <button key={ratio.value} onClick={() => setAspectRatio(ratio.value)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${aspectRatio === ratio.value ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'bg-[var(--background-secondary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)]'}`}>{ratio.name}</button>
                    ))}
                </div>
            </div>
            {/* Resolution Controls */}
            <div className="lg:col-span-2 bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <ScreenResolutionIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t('videoGenerator.resolution')}</h3>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {VIDEO_RESOLUTIONS.map((res) => (
                        <button key={res.value} onClick={() => setResolution(res.value)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${resolution === res.value ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'bg-[var(--background-secondary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)]'}`}>{res.name}</button>
                    ))}
                </div>
            </div>
        </div>

        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <ImageDisplay label={t('videoGenerator.sourceImage')} imageUrl={sourceImage.previewUrl} constrainHeight />
                
                <div className="w-full">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] text-center mb-4">{t('videoGenerator.generatedVideo')}</h2>
                    <div className={`w-full bg-[var(--background-secondary)] rounded-lg shadow-lg flex items-center justify-center overflow-hidden border border-[var(--border-primary)] ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'}`}>
                        {isLoading ? (
                            <div className="p-4 text-center">
                                <Loader />
                                <p className="text-sm text-[var(--text-secondary)] mt-4 animate-pulse">{loadingMessage}</p>
                            </div>
                        ) : generatedVideoUrl ? (
                            <div className="relative w-full h-full group">
                                <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                                <a href={generatedVideoUrl} download={`ai-video-${Date.now()}.mp4`} className="absolute bottom-4 right-4 p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all opacity-0 group-hover:opacity-100" title={t('videoGenerator.downloadVideo')}>
                                    <DownloadIcon className="w-5 h-5" />
                                </a>
                            </div>
                        ) : (
                            <div className="text-[var(--text-secondary)] flex flex-col items-center p-4 text-center">
                                <VideoIcon className="w-16 h-16" />
                                <p className="mt-2">{t('videoGenerator.videoAppearHere')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Video Edit Controls */}
            <div className="bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 shadow-2xl mt-8">
                <div className="relative flex-grow w-full">
                    <MagicWandIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                    <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('videoGenerator.promptPlaceholder')}
                    className="w-full bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-colors"
                    disabled={isLoading}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
                    <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-[var(--accent-primary)] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--border-primary)] disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-colors"
                    >
                    {isLoading ? t('videoGenerator.generating') : t('videoGenerator.generate')}
                    </button>
                    <button
                    onClick={reset}
                    title={t('videoGenerator.startOver')}
                    className="p-3 bg-[var(--danger-primary)] text-white rounded-lg hover:bg-[var(--danger-primary-hover)] disabled:bg-gray-600 transition-colors"
                    disabled={isLoading}
                    >
                    <TrashIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
            
            {isSuggesting && (
                <div className="text-center py-10 mt-8">
                    <p className="text-[var(--text-secondary)] animate-pulse">{t('videoGenerator.analyzing')}</p>
                </div>
            )}
            {!isSuggesting && Object.keys(promptSuggestions).length > 0 && (
                <PromptSuggestions 
                    suggestions={promptSuggestions}
                    onSelect={handleSuggestionSelect}
                    disabled={isLoading}
                />
            )}
        </div>

        {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onConfirm={() => { goPremium(); setShowPremiumModal(false); }} />}
        </>
    );
};
