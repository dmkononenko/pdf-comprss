# Требования к тёмной теме

## Обзор
Реализовать полнофункциональную тёмную тему для Chrome-расширения PDF Compressor с автоматическим определением системных предпочтений и возможностью ручного переключения.

## Анализ текущего состояния

### Существующая инфраструктура
- ✅ Tailwind CSS настроен с HSL цветовыми токенами через CSS custom properties
- ✅ Дизайн-система уже использует семантические имена цветов (primary, secondary, muted и т.д.)
- ❌ Компонент переключения темы удалён (требуется пересоздание)
- ❌ Composable для темы удалён (требуется пересоздание)

### Технологический стек
- Vue 3 (Composition API)
- Tailwind CSS
- WXT Framework (Chrome Extension)
- Chrome Storage API для сохранения настроек

---

## Требования

### 1. Определение и сохранение темы

#### 1.1 Первоначальное определение темы
Приоритет: ВЫСОКИЙ

```
При монтировании:
1. Проверить chrome.storage.local на наличие сохранённой темы
2. Если не найдено, проверить системные предпочтения через window.matchMedia('(prefers-color-scheme: dark)')
3. Использовать 'light' по умолчанию, если предпочтения не обнаружены
```

#### 1.2 Сохранение темы
Приоритет: ВЫСОКИЙ

- Сохранять предпочтение темы в `chrome.storage.local`
- Ключ: `theme`
- Значения: `'light'` | `'dark'` 

---

### 2. Компонент переключения темы

#### 2.1 Спецификация компонента
Файл: `src/components/ThemeToggle.vue`

**Функционал:**
- Трёхпозиционный переключатель: Light / Dark / System
- Визуальная обратная связь для текущей темы
- Доступность (ARIA метки, навигация с клавиатуры)
- Плавные переходы

**Визуальный дизайн:**
```vue
<!-- Состояние по умолчанию: отображать иконку текущей темы (солнце/луна) в зависимости от выбора -->
<!-- При клике: циклически переключать Light → Dark → System → Light -->

Иконки:
- Light: Иконка солнца (☀️)
- Dark: Иконка луны (🌙)
- System: Иконка полукруга (◐) - обозначает автоматический/системный режим
```

**Позиция:**
- Разместить в заголовке рядом с названием "PDF Compressor"
- Выравнивание по правому краю

---

### 3. Composable для темы

#### 3.1 Спецификация composable
Файл: `src/components/composables/useTheme.ts`

**API:**
```typescript
interface UseThemeReturn {
  theme: Ref<'light' | 'dark' | 'system'>
  resolvedTheme: Ref<'light' | 'dark'>  // фактическая применяемая тема
  isDark: Ref<boolean>
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void  // циклическое переключение: light → dark → system
}

function useTheme(): UseThemeReturn
```

**Ответственность:**
- Инициализация темы из хранилища/системы
- Применение класса темы к корневому элементу (`<html>` или корневой `div`)
- Сохранение изменений темы в chrome.storage
- Прослушивание изменений системных предпочтений
- Реактивная обработка обновлений темы

---

### 4. CSS переменные и цветовая система

#### 4.1 Структура цветовых токенов
Приоритет: ВЫСОКИЙ

Определить CSS переменные для светлой и тёмной тем:

```css
/* Светлая тема (по умолчанию) */
:root {
  --background: 0 0% 100%;        /* white */
  --foreground: 222.2 84% 4.9%;   /* #0a0a0a */

  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  --primary: 221.2 83.2% 53.3%;   /* blue-600 */
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;     /* gray-100 */
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 84.2% 60.2%;   /* red-500 */
  --destructive-foreground: 210 40% 98%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  --radius: 0.5rem;
}

/* Тёмная тема */
.dark {
  --background: 222.2 84% 4.9%;   /* #0a0a0a */
  --foreground: 210 40% 98%;       /* #fafafa */

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --primary: 217.2 91.2% 59.8%;   /* blue-500 */
  --primary-foreground: 222.2 47.4% 11.2%;

  --secondary: 217.2 32.6% 17.5%; /* gray-800 */
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  --destructive: 0 62.8% 30.6%;   /* red-900 */
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}
```

#### 4.2 Файл CSS переменных
Файл: `entrypoints/sidepanel/style.css` (добавить к существующему)

Применить класс темы к корневому элементу в App.vue:
```vue
<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen bg-background text-foreground">
    <!-- ... -->
  </div>
</template>
```

---

### 5. Обновление компонентов

#### 5.1 Обновление App.vue
Приоритет: ВЫСОКИЙ

**Необходимые изменения:**
1. Импортировать и использовать `useTheme` composable
2. Добавить компонент ThemeToggle в заголовок
3. Заменить хардкодные цветовые классы на семантические токены

**Было:**
```vue
<div class="min-h-screen bg-gray-50 p-3">
  <h1 class="text-xl font-bold text-gray-900">PDF Compressor</h1>
```

**Станет:**
```vue
<div :class="{ 'dark': isDark }" class="min-h-screen bg-background p-3">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-xl font-bold text-foreground">PDF Compressor</h1>
    <ThemeToggle />
  </div>
```

#### 5.2 Маппинг цветовых классов
Приоритет: СРЕДНИЙ

Обновить все компоненты для использования семантических токенов:

| Текущий (Светлый) | Тёмный эквивалент | Семантический токен |
|-------------------|-------------------|---------------------|
| bg-gray-50 | bg-gray-900 | bg-background |
| text-gray-900 | text-gray-100 | text-foreground |
| bg-white | bg-gray-800 | bg-card |
| border-gray-300 | border-gray-700 | border-border |
| bg-blue-50 | bg-blue-900/20 | bg-accent |
| text-gray-600 | text-gray-400 | text-muted-foreground |

**Затронутые компоненты:**
- `App.vue` (основной контейнер, карточки, кнопки, текст)
- `CompressionLevelSelector.vue`

---

### 6. Анимация и переходы

#### 6.1 Переход темы
Приоритет: НИЗКИЙ (желательно)

Добавить плавный переход при смене темы:

```css
* {
  transition-property: color, background-color, border-color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
```

Применить к корневому элементу в `style.css`.

---

## Порядок реализации

### Фаза 1: Базовая инфраструктура (Обязательно)
1. ✅ Определить CSS переменные для светлой/тёмной темы в `style.css`
2. ✅ Создать composable `useTheme.ts` с интеграцией хранилища
3. ✅ Создать компонент `ThemeToggle.vue`
4. ✅ Интегрировать в App.vue

### Фаза 2: Обновление компонентов (Обязательно)
5. ✅ Обновить App.vue с семантическими цветовыми классами
6. ✅ Обновить CompressionLevelSelector.vue
7. ✅ Обновить другие компоненты с хардкодными цветами

### Фаза 3: Полировка (Желательно)
8. ⏳ Добавить анимации перехода темы
9. ⏳ Убедиться, что все UI компоненты поддерживают обе темы
10. ⏳ Протестировать edge cases (ошибки хранилища, быстрое переключение темы)

---

## Чеклист тестирования

- [ ] Тема сохраняется при перезагрузке расширения
- [ ] Определение системных предпочтений работает при первой загрузке
- [ ] Изменение системных предпочтений triggering обновление темы
- [ ] Ручное переключение циклично работает: Light → Dark → System → Light
- [ ] Весь текст читаем в обеих темах (контрастность)
- [ ] Все кнопки и интерактивные элементы имеют правильные состояния
- [ ] Индикаторы прогресса выглядят хорошо в обеих темах
- [ ] Состояния ошибок отображаются корректно
- [ ] Визуальная обратная связь drag & drop области работает в обеих темах
- [ ] Эмуляция темы в Chrome DevTools работает
- [ ] Нет FOUC (Flash of Unstyled Content) при загрузке

---

## Edge cases и особенности

1. **Контекст Chrome Extension**
   - `chrome.storage.local` асинхронный - обрабатывать состояния загрузки
   - Боковая панель имеет изолированный CSS - убедиться, что стили применяются корректно

2. **Производительность**
   - Debounce для быстрых переключений темы
   - Избегать layout thrashing при смене темы

3. **Доступность**
   - Учитывать `prefers-color-scheme` для пользователей, явно установивших его
   - Обеспечить контрастность WCAG AA в обеих темах
   - Предоставить индикаторы фокуса в обеих темах

4. **Будущая расширяемость**
   - Структура позволяет добавлять больше тем (например, высокий контраст)
   - Цветовые токены упрощают изменение брендовых цветов

---

## Ссылки

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [prefers-color-scheme MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
