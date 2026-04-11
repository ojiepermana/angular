import * as libraryRoot from '@ojiepermana/angular';
import * as layoutEntry from '@ojiepermana/angular/layout';
import * as themeRoot from '@ojiepermana/angular/theme';
import * as themeComponentEntry from '@ojiepermana/angular/theme/component';
import * as themeDirectiveEntry from '@ojiepermana/angular/theme/directive';
import * as themeServiceEntry from '@ojiepermana/angular/theme/service';

describe('library entrypoints', () => {
  it('keeps the root package empty', () => {
    expect(Object.keys(libraryRoot).filter((key) => key !== 'default')).toEqual([]);
  });

  it('keeps the theme namespace entrypoint empty', () => {
    expect(Object.keys(themeRoot).filter((key) => key !== 'default')).toEqual([]);
  });

  it('exposes theme services from the service entrypoint', () => {
    expect(themeServiceEntry).toMatchObject({
      ThemeService: expect.any(Function),
      provideNgTheme: expect.any(Function),
      NG_THEME_CONFIG: expect.any(Object),
    });
  });

  it('exposes theme controls from the component entrypoint', () => {
    expect(themeComponentEntry).toMatchObject({
      AppearanceSwitcherComponent: expect.any(Function),
      ColorPickerComponent: expect.any(Function),
      SchemeSwitcherComponent: expect.any(Function),
    });
  });

  it('exposes layout runtime and controls from the layout entrypoint', () => {
    expect(layoutEntry).toMatchObject({
      LayoutContainerSwitcherComponent: expect.any(Function),
      LayoutHostDirective: expect.any(Function),
      LayoutHorizontalComponent: expect.any(Function),
      LayoutModeSwitcherComponent: expect.any(Function),
      LayoutService: expect.any(Function),
      LayoutVerticalComponent: expect.any(Function),
      NG_LAYOUT_CONFIG: expect.any(Object),
      provideNgLayout: expect.any(Function),
    });
  });

  it('exposes theme directives from the directive entrypoint', () => {
    expect(themeDirectiveEntry).toMatchObject({
      ThemeHostDirective: expect.any(Function),
    });
  });
});
