import { renderSandboxPage } from './pages/Sandbox.js';
import { renderInverseFinderPage } from './pages/InverseFinder.js';
import { renderSolverBenchmarkPage } from './pages/SolverBenchmark.js';
import { renderErrorLandscapePage } from './pages/ErrorLandscape.js';
import { renderTheoryPage } from './pages/Theory.js';

type TabId = 'sandbox' | 'inverse' | 'benchmark' | 'landscape' | 'theory';

class App {
  private mainContent: HTMLElement;
  private currentTab: TabId = 'sandbox';

  constructor() {
    this.mainContent = document.getElementById('main-content')!;
    this.initTabs();
    this.renderCurrentTab();
  }

  private initTabs() {
    const tabs = document.querySelectorAll<HTMLButtonElement>('.nav-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab as TabId;
        if (target && target !== this.currentTab) {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          this.currentTab = target;
          this.renderCurrentTab();
        }
      });
    });
  }

  private renderCurrentTab() {
    this.mainContent.innerHTML = '';
    switch (this.currentTab) {
      case 'sandbox':
        renderSandboxPage(this.mainContent);
        break;
      case 'inverse':
        renderInverseFinderPage(this.mainContent);
        break;
      case 'benchmark':
        renderSolverBenchmarkPage(this.mainContent);
        break;
      case 'landscape':
        renderErrorLandscapePage(this.mainContent);
        break;
      case 'theory':
        renderTheoryPage(this.mainContent);
        break;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
