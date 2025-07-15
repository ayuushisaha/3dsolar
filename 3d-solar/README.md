# Frontend Assignment: 3D Solar System Simulation

This project implements a 3D simulation of our solar system using Three.js, demonstrating skills in 3D rendering, scene creation, object animation, and user interaction.

## Features

### Core Features:
* **Realistic 3D Scene**: A web page with a 3D canvas featuring the Sun at the center and all 8 planets (Mercury to Neptune) orbiting around it.
* **Planetary Motion**: Each planet rotates around the Sun at a default speed, with realistic lighting, camera, and orbit animation.
* **Three.js Implementation**: Utilizes Three.js for creating 3D spherical objects for planets, setting up lighting and camera angles, and animating planetary orbits using `THREE.Clock` and `requestAnimationFrame`.

### Speed Control Feature:
* **Interactive Control Panel**: A control panel is implemented on the page allowing users to adjust the orbital speed of any individual planet in real-time using sliders.
* **Dynamic Animation**: Planet animations immediately reflect changes in speed, powered by plain JavaScript interacting with the Three.js animation loop.

### Bonus Features:
* **Pause/Resume Animation**: A button to pause and resume the entire solar system animation.
* **Background Stars**: A realistic starry background in the scene.
* **Planet Labels on Hover**: Labels or tooltips appear on hover over each planet, displaying its name.
* **Dark/Light Mode Toggle**: A UI toggle to switch between dark and light themes.
* **Camera Controls**: Interactive camera movement and zoom functionality via mouse/touch, provided by `OrbitControls`.

## How to Run the Project

To run this project locally, follow these simple steps:

1.  **Save the files**: Ensure you have `index.html` and `script.js` (and any necessary texture files in a `textures` folder if you chose to implement realistic textures in the past) in the same directory.
2.  **Open `index.html`**: Simply open the `index.html` file in any modern web browser (e.g., Chrome, Firefox, Edge, Safari).
3.  **Interact**:
    * Use the sliders on the control panel to adjust individual planet speeds.
    * Click the "Pause/Resume" button to control the animation.
    * Click the "Light Mode / Dark Mode" button to change the theme.
    * Hover over planets to see their names.
    * Use your mouse (click and drag) or touch gestures to move and zoom the camera.

## Technologies Used

* **HTML5**: For the basic page structure.
* **CSS3**: For styling the control panel and other UI elements.
* **JavaScript (ES6+)**: For core logic, user interaction, and animation control.
* **Three.js (r132)**: The primary JavaScript library used for 3D rendering.
* **Three.js OrbitControls**: For interactive camera manipulation.
```