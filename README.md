# Cognitive Task Assessment

This repository contains two independent implementations of a cognitive assessment tool:

1. **Original Version (v1)** - Written in vanilla JavaScript
2. **Modern Version (v2)** - Implemented with React

Each implementation provides the same core functionality but with different technical approaches.

## Project Structure

```
cognitivetask/
├── images/               # Images for v1
├── shapes/               # Shapes for v1
├── index.html            # Main entry point for v1
├── script.js             # Core logic for v1
├── styles.css            # Styling for v1
├── doc.md                # Documentation for v1
├── v2/                   # React implementation
│   ├── public/           # Static assets for v2
│   │   ├── images/       # Images for v2
│   │   └── shapes/       # Shapes for v2
│   ├── src/              # React source code
│   │   ├── config.js     # React-specific configuration
│   │   └── components/   # React components
│   ├── package.json      # Dependencies for v2
│   └── README.md         # React app documentation
└── README.md             # This file
```

## Features

Both implementations provide the following cognitive tasks:

- **Object Span Task** - Forward and backward recall of object sequences
- **Digit Span Task** - Forward and backward recall of digit sequences
- **Shape Counting Task** - Counting different types of shapes
- **Spatial Memory Task** - Identifying moved objects in spatial arrangements

## Setup and Running

### Original Version (v1)

1. Simply open `index.html` in a web browser
2. No build process required
3. Access at the root URL: `/`

### Modern Version (v2)

1. Navigate to the `v2` directory
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Build for production: `npm run build`
5. Access at `/v2/` URL path

## Development Guidelines

### Version-Specific Guidelines

#### v1 (Vanilla JS)

- Maintain the global state management pattern
- Document all functions with JSDoc comments
- Follow the existing event handling patterns
- Assets (images, shapes) are located in the root `/images` and `/shapes` directories

#### v2 (React)

- Use React hooks for state management
- Create reusable components in `src/components/`
- Follow React best practices (immutable state, etc.)
- Assets are located in `/v2/public/images` and `/v2/public/shapes` 
- Configuration is in `src/config.js`

## Adding New Features

When adding new features:

1. Determine which version(s) to update
2. Add new assets to the appropriate directory for each implementation
3. Document the feature in both this README and in the version-specific documentation
4. Ensure any new data formats are consistently implemented in both versions

## CSV Export Format

Both implementations use identical CSV export formats to ensure compatibility, but maintain separate implementations of the export logic:

```
participant_id,counter_balance,task_type,span_mode,trial_number,timestamp,span_length,attempt_number,is_correct,max_span_reached,total_correct_sequences
```

## Browser Compatibility

- **v1**: Supports modern browsers (Chrome, Firefox, Safari, Edge)
- **v2**: Supports the same browsers plus graceful degradation for older versions

## License

This project is proprietary and confidential. 