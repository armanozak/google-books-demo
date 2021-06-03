import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbar } from '@angular/material/toolbar';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TOOLBAR_COLOR } from '../common/tokens/toolbar-color.token';
import { MainLayoutComponent, MainLayoutModule } from './main-layout.component';

@Component({ template: 'DUMMY CONTENT' })
class DummyContentComponent {}

let fixture: ComponentFixture<MainLayoutComponent>;
let loader: HarnessLoader;
let router: Router;

describe('MainLayoutComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyContentComponent],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: DummyContentComponent,
          },
        ]),
        MainLayoutModule,
      ],
    });
  });

  describe('Toolbar', () => {
    it('should have "Google Books Search" as text', async () => {
      await setup();

      const toolbar = await loader.getHarness(MatToolbarHarness);
      const [title] = await toolbar.getRowsAsText();

      expect(toolbar).toBeTruthy();
      expect(title).toBe('Google Books Search');
    });

    it('should have primary as default color', async () => {
      await setup();

      const toolbar = getToolbar(fixture);

      expect(toolbar.color).toBe('primary');
    });

    it('should have color set by provided token', async () => {
      TestBed.overrideProvider(TOOLBAR_COLOR, { useValue: 'accent' });
      await setup();

      const toolbar = getToolbar(fixture);

      expect(toolbar.color).toBe('accent');
    });
  });

  describe('Content', () => {
    it('should have "DUMMY CONTENT" as text', async () => {
      await setup();
      await router.initialNavigation();

      const content = getContent(fixture);

      expect(content).toBeTruthy();
      expect(content.textContent).toBe('DUMMY CONTENT');
    });
  });
});

function getToolbar(
  fixture: ComponentFixture<MainLayoutComponent>
): MatToolbar {
  return fixture.debugElement.query(By.directive(MatToolbar)).componentInstance;
}

function getContent(
  fixture: ComponentFixture<MainLayoutComponent>
): HTMLElement {
  return fixture.debugElement.query(By.directive(DummyContentComponent))
    .nativeElement;
}

async function setup() {
  await TestBed.compileComponents();
  fixture = TestBed.createComponent(MainLayoutComponent);
  loader = TestbedHarnessEnvironment.loader(fixture);
  router = TestBed.inject(Router);
  fixture.detectChanges();
}
