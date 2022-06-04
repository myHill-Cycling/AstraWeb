import navLinks from "../../../src/helpers/NavigationLinks";

function RootTests() {
    specify("Logo image visible and loaded", () => {
        cy.get("header")
          .find<HTMLImageElement>("img[alt='myHill Cycling']")
          .should("be.visible")
          .and(($img) => {
            // "naturalWidth" and "naturalHeight" are set when the image loads
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });            
    });   
}

function NavTest_ElementNames() {
    cy.get<HTMLUListElement>("@NavList")
          .should("be.visible")
          .then($eventList => {
                const nameList = navLinks.map(x => x.name);
                $eventList.find<HTMLAnchorElement>("li a").each((_i, $eventElement) => {
                        expect($eventElement.text).to.be.oneOf(nameList);
                });
           });
}

function NavTest_ElementUrls() {
    cy.get<HTMLUListElement>("@NavList")
          .should("be.visible")
          .then($eventList => {
                const nameList = navLinks.map(x => x.url);
                $eventList.find<HTMLAnchorElement>("li a").each((_i, $eventElement) => {
                        expect(new URL($eventElement.href).pathname).to.be.oneOf(nameList);

                        // $eventElement.click();
                        // cy.url().should("be.oneOf", urlList);
                        // cy.go("back");
                });
           });
}

function MobileSizeNavigationTests(){
    beforeEach(() => {
        cy.get("#mobile-menu-4 ul").as("NavList");
        cy.get("[data-collapse-toggle='mobile-menu-4']").as("NavMenuToggle");
    });

    specify("Mobile Nav Menu toggle is visible", () => {
        cy.get("@NavMenuToggle")
        .should("be.visible")
        .click()
        .should("be.visible");
    });

    specify("Mobile Nav Accessability", () => {
        cy.injectAxe();

        cy.get("@NavMenuToggle")
        .click();        

        cy.checkA11y();
    });

    specify("List shows all elements", () => {
        cy.get("@NavMenuToggle").click();
        NavTest_ElementNames();
    });

    specify("List contains correct urls", () => {
        cy.get("@NavMenuToggle").click();
        NavTest_ElementUrls();
    });
}

function FullSizeNavigationTests() {
    beforeEach(() => {
        cy.get("#mobile-menu-4 ul").as("NavList");
    });

    specify("Elements are accessible", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
    
    specify("List shows all elements", NavTest_ElementNames);

    specify("List contains correct urls", NavTest_ElementUrls);
}

context("Root Layout", () => {    
    const url = "/";
    context("Header", () => {

        context("Dark mode", () => {
            beforeEach(() => {
                cy.visit(url, {
                    onBeforeLoad (window) {
                        window.localStorage.setItem("color-theme", "dark");
                    },
                });
            });            
            RootTests();
        });

        context("Light mode", () => {
            beforeEach(() => {
                cy.visit(url, {
                    onBeforeLoad (window) {
                        window.localStorage.setItem("color-theme", "light");
                    },
                });
            });
            RootTests();
        });

        context("Navigation", () => {
            context("Desktop Viewport", () => {
                context("Dark mode", () => {
                    beforeEach(() => {
                        cy.visit(url, {
                            onBeforeLoad (window) {
                                window.localStorage.setItem("color-theme", "dark");
                            },
                        });
                    });
    
                    FullSizeNavigationTests();
                });
    
                context("Light mode", () => {
                    beforeEach(() => {
                        cy.visit(url, {
                            onBeforeLoad (window) {
                                window.localStorage.setItem("color-theme", "light");
                            },
                        });
                    });
    
                    FullSizeNavigationTests();
                });
            });

            context("Tablet Viewport", () => {
                context("Dark mode", () => {
                    beforeEach(() => {
                        cy.visit(url, {
                            onBeforeLoad (window) {
                                window.localStorage.setItem("color-theme", "dark");
                            },
                        });
                        cy.viewport("ipad-2");
                    });
    
                    FullSizeNavigationTests();
                });
    
                context("Light mode", () => {
                    beforeEach(() => {
                        cy.visit(url, {
                            onBeforeLoad (window) {
                                window.localStorage.setItem("color-theme", "light");
                            },
                        });
                        cy.viewport("ipad-2");
                    });
    
                    FullSizeNavigationTests();
                });
            });

            context("Mobile Viewport", () => {
                context("Dark mode", () => {
                    beforeEach(() => {
                        cy.visit(url, {
                            onBeforeLoad (window) {
                                window.localStorage.setItem("color-theme", "dark");
                            },
                        });
                        cy.viewport("iphone-6");
                    });
    
                    MobileSizeNavigationTests();
                });
    
                context("Light mode", () => {
                    beforeEach(() => {
                        cy.visit(url, {
                            onBeforeLoad (window) {
                                window.localStorage.setItem("color-theme", "light");
                            },
                        });
                        cy.viewport("iphone-6");
                    });
    
                    MobileSizeNavigationTests();
                });
            });
        });      

    });
});