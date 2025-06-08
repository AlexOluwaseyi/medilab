# Steps to completing assessment task

## Set up Next.JS [Next.JS Docs](https://nextjs.org/docs/app/getting-started/installation)

```sh
$ npx create-next-app@latest
Need to install the following packages:
create-next-app@15.2.1
Ok to proceed? (y) y

√ What is your project named? ... ngoane
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like your code inside a `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to use Turbopack for `next dev`? ... No / Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No / Yes
Creating a new Next.js app in .\ngoane

Using npm.

Initializing project with template: app-tw


Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- @tailwindcss/postcss
- tailwindcss
- eslint
```

## Set up Prisma ORM []()

```sh
$ npm install prisma --save-dev
$ npm install @prisma/client
$ npm install prisma typescript tsx @types/node --save-dev
$ npx prisma init
```

## Update `.env` file

Update username and password for `DATABASE_URL` in `.env` file

## Add model to Prisma Schema

```prisma
model DiagnosticTest {
  id          Int      @id @default(autoincrement())
  patientName String
  testType    String
  result      String
  testDate    DateTime @default(now())
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Map model to database schema

```sh
$ npx prisma migrate dev --name init
```

_Note:_
Required to run postgresql in `trust` mode (without password credentials)
Modify `pg_hba.conf` in `C:\Program Files\PostgreSQL\17\data`

```sh
host    all             all             127.0.0.1/32            trust
```

## @Prisma/client Verification or installation

Verified `@prisma/client` is already included in `package.json`. If not, run `npm install @prisma/client`

## Set up routes for:

- List All Test Results: GET /api/tests.
- Create a Diagnostic Test Result: POST /api/tests.
- Get a Test Result by ID: GET /api/tests/:id.
- Update a Test Result: PUT /api/tests/:id.
- Delete a Test Result: DELETE /api/tests/:id.

## Set up pages for:

- Home: "/"
- Tests: "/tests"
- Tests/[id]: "/tests/:id"

## Set up modals for:

- Creating new record.
- Delete an existing record.
- Update an existing record.

