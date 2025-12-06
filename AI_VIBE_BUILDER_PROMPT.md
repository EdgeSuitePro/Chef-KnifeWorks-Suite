# AI Vibe Builder Prompt: Chef KnifeWorks Reservation & CRM System

## Project Overview
Create a sophisticated dual-interface web application for a premium knife sharpening service business called Chef KnifeWorks. The application consists of two distinct components: 
1. A customer-facing marketing and reservation site
2. A staff-facing CRM/administration system

## Design Aesthetic
- Sophisticated, premium craftsmanship aesthetic reflecting high-end kitchen tools
- Dark theme with warm metallic accents (bronze, sage, steel)
- Clean, minimalist layout emphasizing typography and whitespace
- Professional, trustworthy tone with artisanal craftsmanship cues
- Responsive design optimized for mobile and desktop experiences

### Color Palette
- Primary Accent: Honed Sage (#8B9A88) - Success states, primary buttons
- Secondary Accent: Damascus Bronze (#B06C49) - Highlights, secondary actions
- Background: Carbon Black (#2C2C2C) - Main background
- Cards/Components: Steel Gray (#4A5557) - Card backgrounds
- Text: Whetstone Cream (#F5F3ED) - Primary text
- Borders/Dividers: Subtle white/gray variations with low opacity
- Staff Interface: Clean whites/off-whites with dark text for contrast

### Typography
- Headlines: 'Della Respira' serif font for brand personality
- Body: 'Montserrat' sans-serif for readability
- Font weights: 300 (light), 400 (regular), 600 (semi-bold), 700 (bold)

## Core Features

### Customer-Facing Website
1. **Homepage**
   - Full-screen hero section with compelling headline and call-to-action
   - Value proposition highlighting expertise and convenience
   - Features grid showcasing service benefits
   - Knife journey visualization replacing traditional tracker
   - Gift card promotion section
   - Integrated footer with contact information

2. **Pricing Page**
   - Tiered service offerings with clear descriptions
   - Visual distinction between standard and premium services
   - Volume discount structure display with emphasis on savings
   - Add-on services showcase
   - Transparent philosophy statement about pricing

3. **Reservation System**
   - Multi-step wizard interface:
     * Step 1: Date selection (Today/Tomorrow/Specific date picker)
     * Step 2: Time slot selection (30-minute windows)
     * Step 3: Customer information collection
     * Step 4: Confirmation with Google Calendar integration
   - Real-time validation and progress indicators
   - Responsive calendar widget with availability visualization

4. **Drop-Off Lookup System**
   - Multi-method search (Reservation ID, Phone, Email)
   - Photo upload capability for item documentation
   - Quantity verification step
   - Instant confirmation receipt with reservation details
   - Offline-capable design with localStorage fallback

5. **Pickup Portal**
   - Secure customer verification process
   - Payment status display with PayPal integration
   - Inventory confirmation interface
   - Automated notifications upon completion

6. **Contact Page**
   - Comprehensive contact information display
   - Integrated contact form with topic categorization
   - Interactive map showing business location
   - Clear communication about home shoppe model

### Staff CRM System
1. **Authentication**
   - Secure login with role-based access
   - Persistent session management
   - Fallback authentication for development environments

2. **Dashboard Views**
   - Kanban board for workflow visualization
   - Calendar view for appointment management
   - Drag-and-drop status management
   - Real-time synchronization capabilities

3. **Reservation Management**
   - Detailed reservation cards with customer information
   - Status progression controls
   - Communication logging system
   - Photo gallery for item documentation

4. **Point of Sale System**
   - Dynamic pricing calculator with service modifiers
   - Volume discount automation
   - Custom discount application
   - Invoice generation with PayPal integration
   - Offline payment recording capabilities

5. **Settings Panel**
   - Business configuration management
   - Staff credential administration
   - Discount preset management
   - Integration toggles

## Technical Specifications
- Framework: React with Vite for build optimization
- Routing: React Router DOM with hash-based routing
- State Management: React built-in hooks (useState, useEffect, useContext)
- Animations: Framer Motion for fluid transitions
- Styling: Tailwind CSS with custom CSS variables for theming
- Icons: React Icons library
- Forms: Native HTML forms with custom validation
- Backend Simulation: Express.js server with SQLite persistence
- Data Persistence: Combination of localStorage and SQLite database
- Offline Capability: Graceful degradation with localStorage caching

## Special Requirements
1. **Theming System**
   - Dual theme support (dark customer/light staff)
   - CSS variable-based color system for easy theme switching
   - Automatic theme application based on route context

2. **Performance Optimization**
   - Code splitting for route-based components
   - Lazy loading for non-critical resources
   - Efficient re-rendering strategies
   - Asset optimization techniques

3. **Accessibility Compliance**
   - Semantic HTML structure
   - Keyboard navigation support
   - Proper contrast ratios for text elements
   - Screen reader compatibility

4. **Security Considerations**
   - Client-side authentication simulation
   - Input sanitization practices
   - Secure credential handling (development-focused)

5. **Cross-Browser Compatibility**
   - Modern browser support (Chrome, Firefox, Safari, Edge)
   - Progressive enhancement principles
   - Mobile-first responsive design

## Integration Points
1. **Calendar Systems**
   - Google Calendar integration for appointment scheduling
   - Custom calendar widget for date selection
   - Event synchronization protocols

2. **Payment Processing**
   - PayPal integration through PayPal.me links
   - Payment status tracking mechanisms
   - Offline payment recording workflows

3. **Communication Tools**
   - Email/SMS integration protocols
   - Notification system architecture
   - Communication logging standards

4. **Mapping Services**
   - OpenStreetMap/OpenLayers for location display
   - Direction services integration
   - Location marker customization

## Content Strategy
1. **Tone and Voice**
   - Professional yet approachable
   - Emphasis on expertise and craftsmanship
   - Customer-centric messaging
   - Trust-building language patterns

2. **Messaging Hierarchy**
   - Clear value propositions above the fold
   - Benefit-driven feature descriptions
   - Consistent terminology across interfaces
   - Contextual help and guidance

3. **Content Organization**
   - Logical flow through customer journey
   - Progressive disclosure of complex features
   - Intuitive navigation structures
   - Error messaging with recovery guidance

## User Experience Patterns
1. **Microinteractions**
   - Button press animations
   - Form field focus states
   - Loading indicators with personality
   - Success/error feedback animations

2. **Progressive Disclosure**
   - Step-by-step wizards for complex tasks
   - Expandable sections for additional details
   - Conditional visibility based on context
   - Tooltips for advanced features

3. **Error Handling**
   - Human-readable error messages
   - Inline validation feedback
   - Recovery pathways from errors
   - Logging for debugging purposes

## Deployment Considerations
1. **Hosting Environment**
   - Static site hosting compatible
   - Server-side component isolation
   - CDN-friendly asset structuring
   - Environment-specific configurations

2. **Maintenance Requirements**
   - Automated backup procedures for SQLite data
   - Version control with clear migration paths
   - Monitoring for uptime and performance
   - Regular security audits and updates

3. **Scaling Potential**
   - Modular component architecture
   - Database abstraction layer
   - API-first design principles
   - Caching strategies for performance

This prompt should result in a comprehensive web application that meets all specified requirements while maintaining a consistent aesthetic and user experience across both customer-facing and staff-facing interfaces.