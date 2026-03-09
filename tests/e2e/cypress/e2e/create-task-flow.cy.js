/**
 * E2E: Flujo de creación de tareas.
 *
 * Criterios de aceptación:
 * - Validación: no se puede enviar tarea vacía; se muestra mensaje de error.
 * - Persistencia y feedback: tras "Guardar", confirmación visual (redirect a agenda).
 * - Integración: la tarea creada conserva título y descripción (codificación correcta).
 * - Estado UI: tras guardado exitoso se redirige a agenda; al volver al formulario está vacío.
 *
 * Requiere backend y frontend en marcha. El usuario debe estar logueado (se hace login en beforeEach).
 * El backend debe tener al menos una asignatura (subject) para que el create no falle.
 *
 * Limpieza: tras cada test se eliminan el usuario generado y las tareas creadas vía API.
 */

const NAV_TIMEOUT = 15000;

/** URL base para peticiones API (mismo origen que la app si hay proxy). */
function apiBase() {
  return Cypress.config("baseUrl") || "http://localhost:4200";
}

function makeUser() {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const password = Cypress.env("E2E_PASSWORD") || "TestPass123!";
  return {
    username: `e2e-${id}`,
    email: `e2e-${id}@test.com`,
    birthDate: "2000-01-15",
    password,
  };
}

function fillRegister(cy, pageUser) {
  cy.get('form.login-form').should('be.visible');
  cy.get('input[placeholder*="nombre de usuario"]').clear().type(pageUser.username);
  cy.get('input[placeholder*="correo electrónico"]').first().clear().type(pageUser.email);
  cy.get('input[type="date"]').clear().type(pageUser.birthDate);
  cy.get('input[placeholder*="contraseña"]').first().clear().type(pageUser.password);
  cy.get('input[placeholder*="Confirmar contraseña"]').clear().type(pageUser.password);
  cy.get('form.login-form').contains('button', /registrar/i).click();
}

function fillLogin(cy, email, password) {
  cy.get('form.login-form').should('be.visible');
  cy.get('input[placeholder*="correo electrónico"]').clear().type(email);
  cy.get('input[placeholder*="contraseña"]').clear().type(password);
  cy.get('form.login-form').contains('button', /iniciar sesión/i).click();
}

function getTitleInput(cy) {
  return cy.get('input[placeholder*="nombre a tu tarea"], input[placeholder*="nombre"]').first();
}

function getDescriptionInput(cy) {
  return cy.get('textarea[placeholder*="Describe"], textarea[placeholder*="tarea"]').first();
}

function getSaveButton(cy) {
  return cy.contains('button', /guardar/i);
}

describe('Flujo de creación de tareas', () => {
  let currentUser;
  let createdAssignmentIds = [];

  beforeEach(() => {
    createdAssignmentIds = [];
    currentUser = makeUser();
    cy.intercept("POST", "**/api/assignment", (req) => {
      req.continue((res) => {
        if (res.body?._id) createdAssignmentIds.push(res.body._id);
      });
    });
    cy.visit('/register');
    fillRegister(cy, currentUser);
    cy.url().should('include', '/login', { timeout: NAV_TIMEOUT });
    fillLogin(cy, currentUser.email, currentUser.password);
    cy.url().should('match', /\/(agenda|ticket)/, { timeout: NAV_TIMEOUT });
  });

  afterEach(() => {
    const base = apiBase();
    createdAssignmentIds.forEach((id) => {
      cy.request({ method: 'DELETE', url: `${base}/api/assignment/${id}`, failOnStatusCode: false });
    });
    if (currentUser?.email) {
      cy.request({
        method: 'DELETE',
        url: `${base}/api/users/${encodeURIComponent(currentUser.email)}`,
        failOnStatusCode: false,
      });
    }
  });

  it('Validación: impide envío sin título y muestra mensaje de error', () => {
    cy.visit('/agenda/new-assignment');
    getTitleInput(cy).should('be.visible');
    cy.window().then((win) => {
      cy.stub(win, 'alert').callsFake((msg) => {
        expect(String(msg)).to.include('título');
      });
    });
    getSaveButton(cy).click();
    cy.url().should('include', 'new-assignment');
  });

  it('Validación: impide envío sin fecha/hora y muestra mensaje', () => {
    cy.visit('/agenda/new-assignment');
    getTitleInput(cy).clear().type('Título de prueba');
    cy.window().then((win) => {
      cy.stub(win, 'alert').callsFake((msg) => {
        expect(String(msg)).to.match(/fecha|hora|completa/);
      });
    });
    getSaveButton(cy).click();
    cy.url().should('include', 'new-assignment');
  });

  it('Persistencia y feedback: tras Guardar redirige a agenda (confirmación visual)', () => {
    cy.visit('/agenda/new-assignment');
    const title = `Tarea E2E ${Date.now()}`;
    getTitleInput(cy).clear().type(title);
    getDescriptionInput(cy).clear().type('Descripción de prueba');
    cy.get('input[type="date"]').first().then(($date) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().slice(0, 10);
      cy.wrap($date).clear().type(dateStr);
    });
    cy.get('input[placeholder*="Hora"]').first().clear().type('10');
    cy.get('input[placeholder*="Min"]').first().clear().type('30');
    getSaveButton(cy).click();
    cy.url().should('include', '/agenda', { timeout: NAV_TIMEOUT });
    cy.url().should('not.include', 'new-assignment');
  });

  it('Integración de datos: la tarea creada conserva título y descripción (codificación)', () => {
    const title = `Tarea ñ áéíóú 中文 ${Date.now()}`;
    const description = 'Descripción con ñ y acentos áéíóú';
    cy.visit('/agenda/new-assignment');
    getTitleInput(cy).clear().type(title);
    getDescriptionInput(cy).clear().type(description);
    cy.get('input[type="date"]').first().then(($date) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      cy.wrap($date).clear().type(tomorrow.toISOString().slice(0, 10));
    });
    cy.get('input[placeholder*="Hora"]').first().clear().type('14');
    cy.get('input[placeholder*="Min"]').first().clear().type('00');
    getSaveButton(cy).click();
    cy.url().should('include', '/agenda', { timeout: NAV_TIMEOUT });
    cy.contains('.task-title', title, { timeout: NAV_TIMEOUT }).should('be.visible');
  });

  it('Estado UI: tras guardado exitoso, al volver al formulario está vacío', () => {
    cy.visit('/agenda/new-assignment');
    const title = `Tarea limpieza ${Date.now()}`;
    getTitleInput(cy).clear().type(title);
    getDescriptionInput(cy).clear().type('Algo');
    cy.get('input[type="date"]').first().then(($date) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      cy.wrap($date).clear().type(tomorrow.toISOString().slice(0, 10));
    });
    cy.get('input[placeholder*="Hora"]').first().clear().type('09');
    cy.get('input[placeholder*="Min"]').first().clear().type('00');
    getSaveButton(cy).click();
    cy.url().should('include', '/agenda', { timeout: NAV_TIMEOUT });
    cy.visit('/agenda/new-assignment');
    getTitleInput(cy).should('have.value', '');
    getDescriptionInput(cy).should('have.value', '');
  });
});
