# Обновления XML файлов для тёмной темы

Этот документ содержит полные обновлённые версии XML файлов для реализации тёмной темы.

## 1. docs/development-plan.xml

### Изменения:
1. Добавлен модуль M-THEME-CSS в Layer 0 (ORDER 7)
2. Добавлен модуль M-THEME-COMPOSABLE в Layer 1 (ORDER 4)
3. Добавлен модуль M-THEME-TOGGLE в Layer 2 (ORDER 3)
4. Добавлен модуль M-THEME-INTEGRATION в Layer 3 (ORDER 1)
5. Обновлён ORDER для M-BACKGROUND с 6 на 8
6. Обновлён ORDER для M-SIDEPANEL с 1 на 2
7. Добавлена зависимость M-THEME-INTEGRATION в M-SIDEPANEL
8. Создана новая Phase-5 "Dark Theme"
9. Переименована старая Phase-5 в Phase-6 "Enhancements"

### Полный XML для новых модулей:

```xml
<!-- Layer 0 - No dependencies -->
<M-THEME-CSS NAME="ThemeCSS" TYPE="UTILITY" LAYER="0" ORDER="7">
  <contract>
    <purpose>CSS переменные для светлой и тёмной темы</purpose>
    <inputs>
      <param name="none" type="none" />
    </inputs>
    <outputs>
      <param name="cssVariables" type="CSS custom properties" />
    </outputs>
  </contract>
  <interface>
    <export-root PURPOSE="CSS переменные светлой темы" />
    <export-dark PURPOSE="CSS переменные тёмной темы" />
  </interface>
  <depends>none</depends>
</M-THEME-CSS>

<!-- Layer 1 - Depends on Layer 0 -->
<M-THEME-COMPOSABLE NAME="ThemeComposable" TYPE="UTILITY" LAYER="1" ORDER="4">
  <contract>
    <purpose>Реактивное управление темой с сохранением в chrome.storage</purpose>
    <inputs>
      <param name="none" type="none" />
    </inputs>
    <outputs>
      <param name="theme" type="Ref of theme state" />
      <param name="setTheme" type="Function to set theme" />
      <param name="toggleTheme" type="Function to cycle theme" />
    </outputs>
  </contract>
  <interface>
    <export-useTheme PURPOSE="Main composable for theme management" />
    <export-theme PURPOSE="Current theme ref" />
    <export-resolvedTheme PURPOSE="Actual applied theme ref" />
    <export-isDark PURPOSE="Boolean dark mode ref" />
    <export-setTheme PURPOSE="Set theme function" />
    <export-toggleTheme PURPOSE="Cycle theme function" />
  </interface>
  <depends>M-TYPES</depends>
</M-THEME-COMPOSABLE>

<!-- Layer 2 - Depends on Layer 1 -->
<M-THEME-TOGGLE NAME="ThemeToggle" TYPE="UI_COMPONENT" LAYER="2" ORDER="3">
  <contract>
    <purpose>UI компонент для переключения темы с тремя состояниями</purpose>
    <inputs>
      <param name="click" type="Event" />
    </inputs>
    <outputs>
      <param name="themeChange" type="Event to toggle theme" />
    </outputs>
  </contract>
  <interface>
    <export-default PURPOSE="Theme toggle button component" />
    <export-SunIcon PURPOSE="Sun icon for light theme" />
    <export-MoonIcon PURPOSE="Moon icon for dark theme" />
    <export-SystemIcon PURPOSE="System icon for auto theme" />
  </interface>
  <depends>M-THEME-COMPOSABLE</depends>
</M-THEME-TOGGLE>

<!-- Layer 3 - Entry Points -->
<M-THEME-INTEGRATION NAME="ThemeIntegration" TYPE="INTEGRATION" LAYER="3" ORDER="1">
  <contract>
    <purpose>Интеграция системы тем в основное приложение</purpose>
    <inputs>
      <param name="theme" type="Ref of theme state" />
    </inputs>
    <outputs>
      <param name="themedUI" type="VNode with theme applied" />
    </outputs>
  </contract>
  <interface>
    <export-App PURPOSE="Main app component with theme support" />
  </interface>
  <depends>M-THEME-COMPOSABLE, M-THEME-TOGGLE, M-THEME-CSS</depends>
</M-THEME-INTEGRATION>
```

### Обновление зависимости M-SIDEPANEL:

```xml
<depends>M-COMPRESSION, M-FILEHANDLER, M-STATE, M-TYPES, M-UI-KIT, M-UI-SELECTOR, M-FORMATTERS, M-THEME-INTEGRATION</depends>
```

### Новая фаза реализации:

```xml
<!-- Phase 5: Dark Theme -->
<Phase-5 name="Dark Theme" status="pending">
  <step-1 module="M-THEME-CSS">CSS переменные для тем</step-1>
  <step-2 module="M-THEME-COMPOSABLE">useTheme composable</step-2>
  <step-3 module="M-THEME-TOGGLE">ThemeToggle компонент</step-3>
  <step-4 module="M-THEME-INTEGRATION">Интеграция в App.vue</step-4>
  <step-5 module="M-THEME-INTEGRATION">Обновление цветовых классов в компонентах</step-5>
</Phase-5>
```

---

## 2. docs/knowledge-graph.xml

### Добавить новые модули в секцию `<Project>`:

```xml
<!-- Theme System -->
<M-THEME-CSS NAME="ThemeCSS" TYPE="UTILITY">
  <purpose>CSS переменные для светлой и тёмной темы</purpose>
  <path>entrypoints/sidepanel/style.css</path>
  <depends>none</depends>
  <annotations>
    <var-root PURPOSE="CSS variables for light theme" />
    <var-dark PURPOSE="CSS variables for dark theme" />
  </annotations>
</M-THEME-CSS>

<M-THEME-COMPOSABLE NAME="ThemeComposable" TYPE="UTILITY">
  <purpose>Реактивное управление темой с сохранением в chrome.storage</purpose>
  <path>src/components/composables/useTheme.ts</path>
  <depends>M-TYPES</depends>
  <annotations>
    <fn-useTheme PURPOSE="Main composable for theme management" />
    <fn-setTheme PURPOSE="Set theme and save to storage" />
    <fn-toggleTheme PURPOSE="Cycle through theme modes" />
  </annotations>
</M-THEME-COMPOSABLE>

<M-THEME-TOGGLE NAME="ThemeToggle" TYPE="UI_COMPONENT">
  <purpose>UI компонент для переключения темы с тремя состояниями</purpose>
  <path>src/components/ThemeToggle.vue</path>
  <depends>M-THEME-COMPOSABLE</depends>
  <annotations>
    <comp-ThemeToggle PURPOSE="Theme toggle button component" />
    <comp-SunIcon PURPOSE="Sun icon for light theme" />
    <comp-MoonIcon PURPOSE="Moon icon for dark theme" />
    <comp-SystemIcon PURPOSE="System icon for auto theme" />
  </annotations>
</M-THEME-TOGGLE>

<M-THEME-INTEGRATION NAME="ThemeIntegration" TYPE="INTEGRATION">
  <purpose>Интеграция системы тем в основное приложение</purpose>
  <path>entrypoints/sidepanel/App.vue</path>
  <depends>M-THEME-COMPOSABLE, M-THEME-TOGGLE, M-THEME-CSS</depends>
  <annotations>
    <fn-App PURPOSE="Main app component with theme support" />
  </annotations>
</M-THEME-INTEGRATION>
```

### Добавить CrossLinks перед закрывающим тегом `</Project>`:

```xml
<!-- Theme System Cross Links -->
<CrossLink from="M-THEME-COMPOSABLE" to="M-TYPES" relation="uses types from" />
<CrossLink from="M-THEME-TOGGLE" to="M-THEME-COMPOSABLE" relation="uses theme state from" />
<CrossLink from="M-THEME-INTEGRATION" to="M-THEME-COMPOSABLE" relation="uses theme management from" />
<CrossLink from="M-THEME-INTEGRATION" to="M-THEME-TOGGLE" relation="contains toggle component" />
<CrossLink from="M-THEME-INTEGRATION" to="M-THEME-CSS" relation="applies CSS variables from" />
<CrossLink from="M-SIDEPANEL" to="M-THEME-INTEGRATION" relation="integrates theme system via" />
```

---

## 3. docs/requirements.xml

### Добавить новые use cases в секцию `<UseCases>`:

```xml
<!-- Theme requirements -->
<UC-009>
  <Actor>User</Actor>
  <Action>Selects a theme preference</Action>
  <Goal>To customize the appearance of the extension</Goal>
  <AcceptanceCriteria>
    - User can select Light, Dark, or System theme
    - Theme preference is saved in chrome.storage.local
    - Theme preference persists across extension reloads
  </AcceptanceCriteria>
</UC-009>

<UC-010>
  <Actor>System</Actor>
  <Action>Detects system theme preference</Action>
  <Goal>To automatically apply user's system theme</Goal>
  <AcceptanceCriteria>
    - System theme is detected on first load if no preference saved
    - Changes to system theme are reflected when System mode is selected
    - Fallback to Light theme if system preference cannot be determined
  </AcceptanceCriteria>
</UC-010>

<UC-011>
  <Actor>User</Actor>
  <Action>Toggles theme manually</Action>
  <Goal>To quickly switch between theme modes</Goal>
  <AcceptanceCriteria>
    - Clicking toggle button cycles: Light → Dark → System → Light
    - Visual feedback shows current theme with appropriate icon
    - Theme changes smoothly with CSS transitions
  </AcceptanceCriteria>
</UC-011>
```

---

## Инструкция по применению

Для применения этих изменений нужно переключиться в режим Code и выполнить следующие действия:

1. Обновить `docs/development-plan.xml`:
   - Добавить модули в соответствующие слои
   - Обновить ORDER для существующих модулей
   - Добавить новую Phase-5
   - Переименовать Phase-5 в Phase-6

2. Обновить `docs/knowledge-graph.xml`:
   - Добавить новые модули в секцию `<Project>`
   - Добавить CrossLinks для новых зависимостей

3. Обновить `docs/requirements.xml`:
   - Добавить UC-009, UC-010, UC-011 в секцию `<UseCases>`
