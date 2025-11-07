import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { ImageIcon } from './IconComponents';

export const Favorites: React.FC = () => {
  const { t } = useTranslation();
  const { savedEdits } = useUser();

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 text-center">{t('gallery.title')}</h2>
      {savedEdits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedEdits.map((edit) => (
            <div key={edit.id} className="bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-lg overflow-hidden shadow-lg group">
              <img src={edit.edited} alt={edit.prompt} className="w-full h-48 object-cover" />
              <div className="p-3">
                <p className="text-sm text-[var(--text-primary)] truncate" title={edit.prompt}>
                  <span className="font-semibold">{t('gallery.prompt')}</span> {edit.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-[var(--text-secondary)] bg-[var(--background-tertiary)] border-2 border-dashed border-[var(--border-secondary)] rounded-xl">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p>{t('gallery.empty')}</p>
        </div>
      )}
    </div>
  );
};
