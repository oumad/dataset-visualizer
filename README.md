# Multi Image Dataset Visualizer for Qwen Edit 2509

A premium web application designed to visualize, manage, and export image datasets for training the Qwen Edit 2509 image editing model. This tool streamlines the process of pairing target images with control images and exporting them in a structured format.

## Features

- **Intuitive Drag & Drop Interface**: Easily upload target images and control images.
- **Smart Bulk Upload**: Drop multiple control images at once; the app automatically matches them to targets based on filenames.
- **Interactive Grid**: Visualize your dataset with a responsive, glassmorphism-styled grid.
- **Detailed Inspector**: Zoom in, check resolutions, and verify image pairs in a focused modal view.
- **Customizable View**: Toggle filenames, resolutions, and image fitting (cover/contain) to suit your workflow.
- **Structured Export**: Export your entire dataset as a ZIP file with automatically organized folders (`target`, `control1`, `control2`, `control3`).
- **Responsive Design**: Optimized for various screen sizes with a modern, dark-themed UI.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/dataset-visualizer.git
    cd dataset-visualizer
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Deployment

This project is configured for automatic deployment to **GitHub Pages**.

1.  Push your changes to the `main` branch.
2.  A GitHub Action will automatically build and deploy the site to the `gh-pages` branch.
3.  Ensure GitHub Pages is enabled in your repository settings (Settings > Pages > Source: Deploy from a branch > Branch: `gh-pages`).

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utils**: JSZip, File Saver, React Dropzone

## License

[MIT](LICENSE)
