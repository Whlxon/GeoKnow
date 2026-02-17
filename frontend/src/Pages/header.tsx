import { useTranslation } from 'react-i18next';

import "./index.css";

export const Header = () => {
    const { t } = useTranslation();
    
    return (
        <>
            <div>{t('copyright')}</div>
            <br/>
        </>
    );
}