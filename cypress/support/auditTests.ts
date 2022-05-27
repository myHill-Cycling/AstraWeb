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