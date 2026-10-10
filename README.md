# Addis Eats 🍽️

**A modern food ordering web application built with Next.js and React.**

Addis Eats is a responsive food ordering application inspired by
Ethiopian cuisine. It combines an interactive menu, cart management,
authentication, order handling, and order status updates in a clean,
modern interface.

This project demonstrates practical full-stack development concepts,
including the Next.js App Router, API routes, server actions, session
handling, data validation, caching, image optimization, and SEO.

## Features

-   Responsive interface for desktop and mobile
-   Interactive menu with dish categories and descriptions
-   Menu search with debounced input and data revalidation
-   Shopping cart with item and quantity management
-   User authentication and sign-out
-   Order handling and protected order-related actions
-   Order status updates using periodic data revalidation
-   Role-aware access for staff functionality
-   Protected routes for private application areas
-   Theme toggle and saved favorite dishes
-   SEO support: metadata, social sharing metadata, sitemap, robots
    configuration, and structured data
-   Image optimization using Next.js image features


## Tech Stack

  Technology               Purpose
  ------------------------ --------------------------------------------
  Next.js                  Full-stack React framework and routing
  React                    Component-based user interface
  JavaScript               Application logic
  Tailwind CSS             Styling and responsive layouts
  SWR                      Client-side data fetching and revalidation
  Next.js Route Handlers   API endpoints
  Server Actions           Server-side mutations
  Zod                      Input validation, where configured
  Node.js                  JavaScript runtime
  Git and GitHub           Version control

## Project Structure

``` text
addis-eats-next/
├── public/
│   ├── images/
│   └── og-image.jpg
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── actions/
│   │   ├── menu/
│   │   ├── orders/
│   │   ├── checkout/
│   │   ├── kitchen/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── sitemap.js
│   │   └── robots.js
│   ├── components/
│   └── lib/
├── next.config.mjs
├── package.json
└── README.md
```

*This is an overview of the expected main areas. Update it if your
actual repository differs.*

## Getting Started

### Prerequisites

-   Node.js version supported by your installed Next.js version
-   npm
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/Ifa-bulo/addis-eats-next.git
cd addis-eats-next
```


### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

``` bash
touch .env.local
```

Add the variables required by your application. For example:

``` env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SESSION_SECRET=replace-with-a-strong-random-secret
```

Generate a strong secret with:

``` bash
openssl rand -base64 32
```

Use the generated value for `SESSION_SECRET`. Check the project's
environment-variable requirements and use the exact names expected by
the code.



### 4. Run the development server

``` bash
npm run dev
```

Open <http://localhost:3000> in your browser.

### 5. Build and run for production

``` bash
npm run build
npm run start
```

Resolve build errors and review warnings before deployment.

## Security Considerations

Security-related implementation areas include:

-   Signed session cookies to help protect session integrity
-   Cookie attributes such as `HttpOnly`, `SameSite`, and production
    `Secure` settings
-   Authentication checks for private resources
-   Server-side authorization and ownership checks for order operations
-   Server-side validation of incoming data
-   Safe redirect handling
-   Keeping session secrets in environment variables

Middleware or Next.js Proxy checks should not be the only security
layer. Pages, route handlers, and server actions must independently
enforce the authentication and authorization required for each
operation.

**Production limitation:** If the application uses in-memory demo data,
that data is not durable and may not be shared across serverless
instances. A production deployment should use a persistent database and
review rate limiting, logging, error handling, and session management.

## Performance

The application uses or is designed to use techniques such as:

-   Server rendering where appropriate
-   SWR caching and revalidation
-   Debounced menu search
-   Next.js image optimization
-   Lazy loading for suitable components
-   Loading, empty, and error states

Measure performance with a production build and tools such as Lighthouse
and browser developer tools. Do not claim a specific Lighthouse score or
loading time until measured.

## SEO and Social Sharing

SEO-related features may include:

-   Page titles and descriptions
-   Open Graph metadata for link previews
-   Twitter/X card metadata
-   A social preview image
-   Sitemap generation
-   Robots configuration
-   Structured data on relevant pages

Before deployment, set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS URL
of the deployed site and confirm that the social preview image is
publicly accessible. Verify `/sitemap.xml`, `/robots.txt`, and the
rendered metadata on the deployed site.

Social metadata enables compatible platforms to create link previews; it
does not automatically publish posts to social media. Robots directives
are not a security mechanism for private routes.

## Testing Checklist

-   [ ] The application starts without errors.
-   [ ] Menu search and category filtering work as expected.
-   [ ] Cart quantities and totals update correctly.
-   [ ] Authentication and sign-out work correctly.
-   [ ] Unauthenticated users cannot access protected resources.
-   [ ] Users cannot view or modify another user's orders.
-   [ ] Invalid input is rejected or handled safely.
-   [ ] Layout works on mobile and desktop.
-   [ ] Images have appropriate alternative text.
-   [ ] The production build succeeds.
-   [ ] Metadata, sitemap, robots configuration, and social preview
    images are correct.
-   [ ] No secrets or sensitive data are committed.

## Future Improvements

Potential next steps include:

-   Persistent database integration
-   Automated unit and end-to-end tests
-   More robust order notifications
-   Payment provider integration, where available and appropriate
-   Monitoring, logging, and deployment automation

## About

Addis Eats is a full-stack development project focused on applying
modern JavaScript technologies to a practical food ordering experience.
It brings together frontend development, server-side functionality, API
design, authentication, data handling, and web performance
considerations.

## License

No license is specified yet. Add a `LICENSE` file and update this
section if you intend to distribute the project as open source.

------------------------------------------------------------------------

**Built with Next.js and React.**
