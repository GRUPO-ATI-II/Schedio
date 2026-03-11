/**
 * Integración Frontend–Backend: Registro, Login y persistencia de sesión.
 *
 * Requiere backend y frontend en marcha (p. ej. docker compose up).
 * baseUrl en cypress.config.js debe apuntar al frontend (localhost:4200 o http://frontend:4200).
 */

const NAV_TIMEOUT = 15000;

function makeUser() {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return {
    username: `e2e-${id}`,
    email: `e2e-${id}@test.com`,
    birthDate: '2000-01-15',
    password: 'TestPass123!',
  };
}

function fillRegister(pageUser) {
  cy.get('form.login-form').should('be.visible');
  cy.get('input[placeholder*="nombre de usuario"]').clear().type(pageUser.username);
  cy.get('input[placeholder*="correo electrónico"]').first().clear().type(pageUser.email);
  cy.get('input[type="date"]').clear().type(pageUser.birthDate);
  cy.get('input[placeholder*="contraseña"]').first().clear().type(pageUser.password);
  cy.get('input[placeholder*="Confirmar contraseña"]').clear().type(pageUser.password);
  cy.get('form.login-form').contains('button', /registrar/i).click();
}

function fillLogin(email, password) {
  cy.get('form.login-form').should('be.visible');
  cy.get('input[placeholder*="correo electrónico"]').clear().type(email);
  cy.get('input[placeholder*="contraseña"]').clear().type(password);
  cy.get('form.login-form').contains('button', /iniciar sesión/i).click();
}

describe('Integración Frontend–Backend: Registro, Login y Sesión', () => {
  it('Registro redirige a login y login da acceso al home', () => {
    const user = makeUser();
    cy.visit('/register');
    fillRegister(user);
    cy.url().should('include', '/login', { timeout: NAV_TIMEOUT });
    fillLogin(user.email, user.password);
    cy.url().should('include', '/agenda', { timeout: NAV_TIMEOUT });
  });

  it('Tras login el token se guarda en localStorage', () => {
    const user = makeUser();
    cy.visit('/register');
    fillRegister(user);
    cy.url().should('include', '/login', { timeout: NAV_TIMEOUT });
    fillLogin(user.email, user.password);
    cy.url().should('include', '/agenda', { timeout: NAV_TIMEOUT });

    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.be.a('string').and.not.to.be.empty;
    });
  });

  it('Ruta protegida /agenda redirige a login sin sesión', () => {
    cy.visit('/agenda');
    cy.url().should('include', '/login');
  });

  it('Login con credenciales incorrectas muestra alerta', () => {
    cy.visit('/login');
    cy.get('input[placeholder*="correo electrónico" i]').type('noexiste@test.com');
    cy.get('input[placeholder*="contraseña" i]').type('wrong');
    cy.contains('button', /iniciar sesión/i).click();

    cy.contains(/credenciales incorrectas/i).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('Validación: campos vacíos en login muestran mensaje', () => {
    cy.visit('/login');
    cy.contains('button', /iniciar sesión/i).click();
    cy.contains(/\* campos obligatorios/i).should('be.visible');
  });
});
