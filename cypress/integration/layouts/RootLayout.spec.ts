import navLinks from "../../../src/helpers/NavigationLinks";
import {AccessabilityTest} from "../../support/auditTests";

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

        cy.get("@NavMenuToggle")
        .click();        

        AccessabilityTest();
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
        AccessabilityTest();
    });
    
    specify("List shows all elements", NavTest_ElementNames);

    specify("List contains correct urls", NavTest_ElementUrls);
}

function DarkModeTests(mode: "light" | "dark"){

    function fetchButton() {
        return cy.get(`[aria-label="Switch to ${mode === "light" ? "dark" : "light" } mode"]`);
    }

    specify("Button is visible", () => {
        fetchButton().should("be.visible");
    });

    specify("Button toggles local storage", () => {
        fetchButton()
        .click()
        .then(() => {
            if(mode === "dark"){
                expect(window.localStorage.getItem("color-theme")).to.not.eq("dark");
            }
            else {
                expect(window.localStorage.getItem("color-theme")).to.eq("dark");
            }
        });
    });
}

function CookieConsentTests() {
    specify("Cookie Consent is shown", () => {
        cy.contains("Allow all cookies").should("be.visible");
        cy.contains("Deny all").should("be.visible");
        cy.contains("Cookie settings").should("be.visible");
        cy.get(".ch2-learn-more").should("be.visible");
    });
}

context("Root Layout", () => {    
    const url = "/";

    context("Cookie Consent", () => {
        context("Dark mode", () => {
            beforeEach(() => {
                cy.visit(url, {
                    onBeforeLoad (window) {
                        window.localStorage.setItem("color-theme", "dark");
                    },
                });
            });

            CookieConsentTests();
        });
        context("Light mode", () => {
            beforeEach(() => {
                cy.visit(url, {
                    onBeforeLoad (window) {
                        window.localStorage.setItem("color-theme", "light");
                    },
                });
            });

            CookieConsentTests();
        });
        
    });  


    context("Header", () => {

        context("Dark mode toggle", () => {
            context("Desktop viewport", () => {
                context("Dark mode", () => {
                    beforeEach(() => {
                        cy.visit(url, {
                            onBeforeLoad (window) {
                                window.localStorage.setItem("color-theme", "dark");
                            },
                        });
                    });
    
                    DarkModeTests("dark");
                });
    
                context("Light mode", () => {
                    beforeEach(() => {
                        cy.visit(url, {
                            onBeforeLoad (window) {
                                window.localStorage.setItem("color-theme", "light");
                            },
                        });
                    });
    
                    DarkModeTests("light");
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
    
                    DarkModeTests("dark");
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
    
                    DarkModeTests("light");
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
    
                    DarkModeTests("dark");
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
    
                    DarkModeTests("light");
                });
            });
        });

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