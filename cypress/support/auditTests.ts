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

export function RunLighthouseAudit(url: string, view: "desktop" | "tablet" | "mobile") {

    const thersholds: Cypress.LighthouseThresholds = {
        performance: 75,
        pwa: null,
        accessibility: null,
        "best-practices": 80,
        seo: 80
    };

    const desktopConfig = {
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
    };

    const tabletConfig = {
        formFactor: "mobile",
        screenEmulation: {
            width: 855,
            height: 790,
            deviceScaleRatio: 1,
            mobile: true,
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
    };

    const phoneConfig = {
        formFactor: "mobile",
        screenEmulation: {
            width: 855,
            height: 790,
            deviceScaleRatio: 1,
            mobile: true,
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
    };

    function RunTest(){
        let config;
        switch(view){
            case "desktop":
                config = desktopConfig;
                break;
            case "tablet":
                config = tabletConfig;
                break;
            case "mobile":
                config = phoneConfig;
                break;
        }

        cy.lighthouse(thersholds, config);
    }

    context("Lighthouse", {
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
            
            RunTest();
        });

        specify("Dark mode", () => {
            cy.visit(url, {
                onBeforeLoad (window) {
                    window.localStorage.setItem("color-theme", "dark");
                },
            });

            RunTest();
        });
    });
}