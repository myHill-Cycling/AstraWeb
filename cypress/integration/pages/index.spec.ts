import type {Event} from "../../fixtures";
import { RunAccessabilityAudit } from "../../support/auditTests";

function EventListing() {
    beforeEach(() => {
        cy.contains("Events").parent<HTMLDivElement>().find<HTMLUListElement>("ul").as("EventListElement");
    });

    specify("Event list visible", () => {
        cy.get<HTMLUListElement>("@EventListElement")       
            .should("be.visible")
            .then(($eventList) => {            
                cy.fixture<Event[]>("events").then(events => {
                    const eventCount = events.length;
                    expect($eventList.find("li").length).to.be.eq(eventCount);
                });
            });
    });

    specify("Event list contains correct names", () => {
        cy.get<HTMLUListElement>("@EventListElement")
          .then($eventList => {
            cy.fixture<Event[]>("events").then(events => {
                const nameList = events.map(x => x.name);

                $eventList.find<HTMLImageElement>("li img").each((_i, $eventElement) => {
                    const altText = $eventElement.alt;
                    expect(altText).to.be.oneOf(nameList);
                });
            });
          });
    });

    specify("Event list contains correct urls", () => {
        cy.get<HTMLUListElement>("@EventListElement")
          .then($eventList => {
            cy.fixture<Event[]>("events").then(events => {
                cy.location("origin").then(origin => {
                    const urlList = events.map(x => new URL(x.url, origin).toString());

                    $eventList.find<HTMLAnchorElement>("li a").each((_i, $eventElement) => {
                        const href = $eventElement.href;
                        expect(href).to.be.oneOf(urlList);

                        // $eventElement.click();
                        // cy.url().should("be.oneOf", urlList);
                        // cy.go("back");
                    });
                });
            });
          });
    });
}

function WelcomeBanner() {
    specify("Welcome text visible", () => {
        cy.contains("aspire:enjoy:inspire")
          .should("be.visible");
    });

    specify("Welcome image visible and loaded", () => {
        cy.get<HTMLImageElement>("[role='presentation']")
          .should("be.visible")
          .and(($img) => {
            // "naturalWidth" and "naturalHeight" are set when the image loads
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });
    });

    specify("Welcome quote visible", () => {
        cy.contains("John F Kennedy")
          .should("contain.text", "Nothing compares to the simple pleasure of riding a bike");
    });
}

context("Index Page", () => {
    specify("Load success", () => {
        cy.visit("/", {
            onBeforeLoad(window){
                delete Object.getPrototypeOf(window.navigator).ServiceWorker;
            }
        });
    });

    context("Desktop viewport", () => {

        RunAccessabilityAudit("/");

        context("Welcome banner", () => {
            context("Dark mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "dark");
                        },
                    });
                });
                WelcomeBanner();
            });

            context("Light mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "light");
                        },
                    });
                });
                WelcomeBanner();
            });
        });

        context("Event listing", () => {
            context("Dark mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "dark");
                        },
                    });
                });
                EventListing();
            });

            context("Light mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "light");
                        },
                    });
                });
                EventListing();
            });
        });
    });

    context("Tablet viewport", () => {
        beforeEach(() => {
            cy.viewport("ipad-2");
        });

        RunAccessabilityAudit("/");

        context("Welcome banner", () => {
            context("Dark mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "dark");
                        },
                    });
                });
                WelcomeBanner();
            });

            context("Light mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "light");
                        },
                    });
                });
                WelcomeBanner();
            });
        });

        context("Event listing", () => {
            context("Dark mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "dark");
                        },
                    });
                });
                EventListing();
            });

            context("Light mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "light");
                        },
                    });
                });
                EventListing();
            });
        });
    });

    context("Mobile viewport", () => {
        beforeEach(() => {
            cy.viewport("iphone-6");
        });

        RunAccessabilityAudit("/");

        context("Welcome banner", () => {
            context("Dark mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "dark");
                        },
                    });
                });
                WelcomeBanner();
            });

            context("Light mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "light");
                        },
                    });
                });
                WelcomeBanner();
            });
        });

        context("Event listing", () => {
            context("Dark mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "dark");
                        },
                    });
                });
                EventListing();
            });

            context("Light mode", () => {
                beforeEach(() => {
                    cy.visit("/", {
                        onBeforeLoad (window) {
                            delete Object.getPrototypeOf(window.navigator).ServiceWorker;
                            window.localStorage.setItem("color-theme", "light");
                        },
                    });
                });
                EventListing();
            });
        });
    });
});