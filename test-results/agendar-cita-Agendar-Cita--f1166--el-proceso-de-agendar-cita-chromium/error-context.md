# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: Iniciar Sesión
      - generic [ref=e6]: Ingresa a tu cuenta de CREA Bienestar
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - text: Correo Electrónico
          - textbox "Correo Electrónico" [ref=e10]:
            - /placeholder: tu-email@crea.edu.pe
        - generic [ref=e11]:
          - text: Contraseña
          - textbox "Contraseña" [ref=e12]
        - button "Iniciar Sesión" [ref=e13]
      - link "¿Olvidaste tu contraseña?" [ref=e15] [cursor=pointer]:
        - /url: /recuperar-password
      - generic [ref=e16]:
        - text: ¿No tienes cuenta?
        - link "Regístrate aquí" [ref=e17] [cursor=pointer]:
          - /url: /registro
  - button "Open Next.js Dev Tools" [ref=e23] [cursor=pointer]:
    - img [ref=e24]
  - alert [ref=e27]
```