const transitionDelay = 1500;

export function AccessabilityTest() {
    cy.injectAxe();

    cy.contains("Allow all cookies")
    .should("be.visible");

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(transitionDelay); //We need to wait to ensure that transitions are completed before checking things like contrast  
    cy.checkA11y();
}

export function RunAccessabilityAudit(url: string){
    context("Accessability", () => {
        specify("Light mode", () => {
            cy.visit(url, {
                onBeforeLoad (window) {
                    window.localStorage.setItem("color-theme", "light");
                },
              });    
            AccessabilityTest();  
        });

        specify("Dark mode", () => {
            cy.visit(url, {
                onBeforeLoad (window) {
                    window.localStorage.setItem("color-theme", "dark");
                },
              });
            AccessabilityTest();
        });
    });
}