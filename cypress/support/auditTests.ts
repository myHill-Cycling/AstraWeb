export function RunAccessabilityAudit(url: string){
    context("Accessability", {
        retries: {
            runMode: 2,
            openMode: 1,
          }
    }, () => {
        specify("Light mode", () => {
            cy.visit(url, {
                onBeforeLoad (window) {
                    window.localStorage.setItem("color-theme", "light");
                },
              });
            cy.injectAxe();
            cy.checkA11y();         
        });

        specify("Dark mode", () => {
            cy.visit(url, {
                onBeforeLoad (window) {
                    window.localStorage.setItem("color-theme", "dark");
                },
              });
            cy.injectAxe();
            cy.checkA11y(); 
        });
    });
}

function LighthouseAuditBlock() {

    const thersholds: Cypress.LighthouseThresholds = {
        performance: 95,
        pwa: null,
        accessibility: null,
        "best-practices": 100,
        seo: 100
    };

    specify("Desktop", () => {
        cy.lighthouse(thersholds, {
            formFactor: "desktop",
            screenEmulation: {
                width: 1350,
                height: 940,
                deviceScaleRatio: 1,
                mobile: false,
                disable: false,
            },
            throttling: {
                rttMs: 40,
                throughputKbps: 11024,
                cpuSlowdownMultiplier: 1,
                requestLatencyMs: 0,
                downloadThroughputKbps: 0,
                uploadThroughputKbps: 0,
            }
        });
    });

    specify("Tablet", () => {
        cy.lighthouse(thersholds, {
            formFactor: "mobile",
            screenEmulation: {
                width: 855,
                height: 790,
                deviceScaleRatio: 1,
                mobile: false,
                disable: false,
            },
            throttling: {
                rttMs: 300,
                throughputKbps: 700,
                requestLatencyMs: 300 * 3.75,
                downloadThroughputKbps: 700 * 0.9,
                uploadThroughputKbps: 700 * 0.9,
                cpuSlowdownMultiplier: 4,
            }
        });
    });

    specify("Phone", () => {
        cy.lighthouse(thersholds, {
            formFactor: "mobile",
            screenEmulation: {
                width: 855,
                height: 790,
                deviceScaleRatio: 1,
                mobile: false,
                disable: false,
            },
            throttling: {
                rttMs: 150,
                throughputKbps: 1.6 * 1024,
                requestLatencyMs: 150 * 3.75,
                downloadThroughputKbps: 1.6 * 1024 * 0.9,
                uploadThroughputKbps: 750 * 0.9,
                cpuSlowdownMultiplier: 4,
            }
        });
    });
}

export function RunLighthouseAudit(url: string) {
    context("Lighthouse", {
        retries: {
            runMode: 2,
            openMode: 1,
          }
    }, () => {        

        context("Light mode", () => {      
            beforeEach(() => {
                cy.visit(url, {
                    onBeforeLoad (window) {
                        window.localStorage.setItem("color-theme", "light");
                    },
                });
            });
            
            LighthouseAuditBlock();
        });

        context("Dark mode", () => {
            beforeEach(() => {
                cy.visit(url, {
                    onBeforeLoad (window) {
                        window.localStorage.setItem("color-theme", "dark");
                    },
                });
            });

            LighthouseAuditBlock();
        });
    });
}