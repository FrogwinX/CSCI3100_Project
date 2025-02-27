## Development Guideline

- Create a new branch with `git checkout -b frontend-NEW-COMPONENT-NAME` before building a new component (replace "NEW-COMPONENT-NAME" with the actual component name)
- Organize the files with reference to [Project Directories](#project-directories)
- Colour components by following the [colour guideline](https://v5.daisyui.com/docs/colors/)
- Use `npm run dev` to start a development server to see real-time file changes
- Have others to review your code before merging the component branch to the frontend branch

## Project Directories

- **public/**: Contains static files that are directly served by the web server
- **src/**: Contains the application source code.
- **src/app/**: Contains Next.js App Router pages and layouts
- **src/components/**: Contains reusable components, <ins>each in its own folder</ins>.
- **src/utils/**: Contains utility functions and shared libraries.
- **src/hooks/**: Contains custom React hooks.

## Documentation and Useful Links

1. [Next.js](https://nextjs.org/docs/app/building-your-application) : Web Dev Framework
2. [React](https://react.dev/learn/your-first-component) : UI Framework
3. [DaisyUI](https://v5.daisyui.com/components/) : Components and theme
4. [Tailwind CSS](https://tailwindcss.com/docs/styling-with-utility-classes) : Styling
