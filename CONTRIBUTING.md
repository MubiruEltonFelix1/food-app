# Contributing to MUST E-Cafeteria

Thank you for your interest in contributing to MUST E-Cafeteria! This document provides guidelines and instructions for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots or videos if applicable
   - Device/browser information

### Suggesting Features

1. **Search existing feature requests** to avoid duplicates
2. **Use the feature request template**
3. **Provide clear use cases** and benefits
4. **Include mockups or wireframes** if possible

### Code Contributions

#### Prerequisites
- Node.js v14 or higher
- Git knowledge
- Basic React and JavaScript skills

#### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YourUsername/food-app.git
   cd food-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the coding standards below
   - Test your changes thoroughly
   - Update documentation if needed

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use the PR template
   - Provide clear description of changes
   - Link related issues

## 📋 Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Follow **ESLint configuration**
- Use **camelCase** for variables and functions
- Use **PascalCase** for components
- Keep components **small and focused**

### CSS

- Use **CSS Grid and Flexbox** for layouts
- Follow **mobile-first** approach
- Use **CSS custom properties** for theming
- Keep animations **smooth and purposeful**

### File Structure

- Components in `src/components/`
- Pages in `src/pages/`
- Utilities in `src/utils/`
- Context providers in `src/contexts/`

### Commit Messages

Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests

Examples:
```
feat: add mobile search overlay
fix: resolve cart badge display issue
docs: update installation instructions
```

## 🧪 Testing

- Test on multiple devices and browsers
- Verify responsive design works correctly
- Test accessibility with screen readers
- Validate forms and error handling

### Testing Checklist

- [ ] Mobile responsiveness (480px, 768px, 1200px+)
- [ ] Cross-browser compatibility
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Performance (smooth animations, fast loading)
- [ ] Error handling (network errors, invalid inputs)

## 📱 Mobile Development Guidelines

### Design Principles
- **Mobile-first**: Design for mobile, enhance for desktop
- **Touch-friendly**: Minimum 44px touch targets
- **Performance**: Optimize animations and loading
- **Accessibility**: Clear labels and navigation

### Responsive Breakpoints
- Mobile: ≤ 480px
- Tablet: ≤ 768px  
- Desktop: > 768px

## 🎨 Design Guidelines

### Color Usage
- Primary: Amber (`#f59e0b`)
- Background: Dark Slate (`#1e293b`)
- Text: White/Light Gray
- Status colors for orders/alerts

### Typography
- Font: Inter, Segoe UI, sans-serif
- Headings: Bold (700-800)
- Body: Regular (400-500)
- Clear hierarchy and spacing

### Animations
- Smooth transitions (0.3s ease)
- Purposeful animations only
- GPU-accelerated when possible
- Respect user motion preferences

## 🔧 Development Setup

### Environment Variables
```env
REACT_APP_API_URL=your_api_url
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

### Useful Commands
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Mobile responsiveness tested
- [ ] Accessibility verified
- [ ] Performance impact considered
- [ ] PR description is clear and complete

## 🎯 Priority Areas

We especially welcome contributions in:

1. **Performance optimization**
2. **Accessibility improvements**
3. **Mobile UX enhancements**
4. **Test coverage**
5. **Documentation**
6. **Bug fixes**

## ❓ Questions?

- Create an issue for general questions
- Join our community discussions
- Check existing documentation first
- Be respectful and patient

## 📜 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn
- Follow community guidelines

Thank you for contributing to MUST E-Cafeteria! 🍽️
