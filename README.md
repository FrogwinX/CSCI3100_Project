## Development Guideline

- Create a new branch with `git checkout -b frontend-NEW-COMPONENT-NAME` before building a new component (replace "NEW-COMPONENT-NAME" with the actual component name)
- Organize the files with reference to [Project Directories](#project-directories)
- Colour components by following the [colour guideline](https://v5.daisyui.com/docs/colors/)
- Use `npm run dev` to start a development server to see real-time file changes
- Have others to review your code before merging the component branch to the frontend branch

## Project Directories

- **public/**: Contains static files that are directly served by the web server
- **src/**: Contains the application source code.
- **src/assets/**: Contains static assets that are imported into TypeScript files
- **src/components/**: Contains reusable components, <ins>each in its own folder</ins>.
- **src/pages/**: Contains the main pages of the application, <ins>each in its own folder</ins>.
- **src/services/**: Contains service files for making API calls and handling authentication.
- **src/hooks/**: Contains custom React hooks.
- **src/utils/**: Contains utility functions and constants.

## Documentation and Useful Links

1. [React](https://react.dev/learn/your-first-component) : UI Framework
2. [DaisyUI](https://v5.daisyui.com/components/) : Components and theme
3. [Tailwind CSS](https://tailwindcss.com/docs/styling-with-utility-classes) : Styling
