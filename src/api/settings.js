// src/api/settings.js
// Локальная реализация, т.к. в бэкенде нет соответствующего API

export const settingsAPI = {
  /**
   * Загрузить логотип
   */
  uploadLogo(logoFile) {
    return new Promise((resolve, reject) => {
      if (!logoFile || !logoFile.type.startsWith('image/')) {
        return reject(new Error('Некорректный файл для логотипа.'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target.result;
        localStorage.setItem('terminalLogo', logoUrl);
        resolve({ success: true, logoUrl });
      };
      reader.onerror = (error) => {
        console.error('Ошибка чтения файла логотипа:', error);
        reject(new Error('Ошибка при загрузке логотипа.'));
      };
      reader.readAsDataURL(logoFile);
    });
  },
  
  /**
   * Получить текущий логотип
   */
  getLogo() {
    const logoUrl = localStorage.getItem('terminalLogo');
    return Promise.resolve({ logoUrl: logoUrl || null }); // Return null if not set
  },
  
  /**
   * Установить видеозаставку
   */
  setVideoBackground(videoFile) {
    return new Promise((resolve, reject) => {
      if (!videoFile || !videoFile.type.startsWith('video/')) {
        return reject(new Error('Некорректный файл для видеозаставки.'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const videoUrl = e.target.result;
        localStorage.setItem('terminalVideo', videoUrl);
        resolve({ success: true, videoUrl });
      };
      reader.onerror = (error) => {
        console.error('Ошибка чтения файла видео:', error);
        reject(new Error('Ошибка при загрузке видео.'));
      };
      reader.readAsDataURL(videoFile);
    });
  },
  
  /**
   * Получить текущую видеозаставку
   */
  getVideoBackground() {
    const videoUrl = localStorage.getItem('terminalVideo');
    return Promise.resolve({ videoUrl: videoUrl || null }); // Return null if not set
  }
};
