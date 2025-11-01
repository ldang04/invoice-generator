# ShopGarage Design System Analysis

## 1. Tailwind Config Extend Snippet

See `tailwind.config.ts` for the complete configuration.

## 2. Example Component ClassNames

### Button Component
```tsx
// Primary Button (Orange accent)
<button className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
  Generate PDF
</button>

// Secondary Button (Outline)
<button className="px-6 py-2.5 border-2 border-neutral-300 text-neutral-900 font-medium rounded-xl hover:bg-neutral-50 active:scale-[0.99] transition-all duration-200">
  Cancel
</button>

// Ghost Button
<button className="px-4 py-2 text-neutral-600 font-normal hover:text-neutral-900 transition-colors">
  Learn More
</button>
```

### Card Component
```tsx
// Standard Card
<div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 hover:shadow-xl transition-shadow">
  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Card Title</h3>
  <p className="text-sm text-neutral-600 leading-relaxed">Card description text.</p>
</div>

// Product/Listing Card
<div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg transition-all">
  <div className="aspect-video bg-neutral-100"></div>
  <div className="p-4">
    <h4 className="font-semibold text-neutral-900 mb-1">Item Title</h4>
    <p className="text-lg font-bold text-primary-500">$125,000.00</p>
  </div>
</div>
```

### Navbar Component
```tsx
<nav className="w-full sticky top-0 z-50 bg-white border-b border-neutral-200">
  <div className="px-4 py-3 flex items-center justify-between w-full max-w-screen-xl mx-auto">
    <div className="flex items-center space-x-6">
      <a href="/" className="font-semibold text-neutral-950 tracking-wide">Logo</a>
      <button className="hidden md:block text-neutral-950 font-normal tracking-wide">Auctions</button>
      <button className="hidden md:block text-neutral-950 font-normal tracking-wide">Sell</button>
    </div>
    <button className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
      Log in
    </button>
  </div>
</nav>
```

### Hero Component
```tsx
<section className="relative bg-gradient-to-b from-neutral-50 to-white py-24 px-4">
  <div className="max-w-screen-xl mx-auto text-center">
    <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">
      America's Marketplace
    </h1>
    <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8 leading-relaxed">
      Buy and sell emergency vehicles and surplus equipment nationwide.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all">
        Browse Listings
      </button>
      <button className="px-8 py-3 border-2 border-neutral-300 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-all">
        Sell Equipment
      </button>
    </div>
  </div>
</section>
```

### Input Component
```tsx
<input
  type="text"
  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
  placeholder="Enter search term..."
/>
```

### Badge/Tag Component
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
  Featured
</span>
```

## 3. Typography Scale & Container Widths

### Typography Scale
- **Display (Hero)**: `text-5xl` to `text-6xl` (3rem - 3.75rem), font-bold
- **Heading 1**: `text-4xl` (2.25rem), font-bold, line-height: 2.5rem
- **Heading 2**: `text-3xl` (1.875rem), font-semibold, line-height: 2.25rem
- **Heading 3**: `text-2xl` (1.5rem), font-semibold, line-height: 2rem
- **Body Large**: `text-lg` (1.125rem), font-normal, line-height: 1.75rem
- **Body**: `text-base` (1rem), font-normal, line-height: 1.5rem
- **Body Small**: `text-sm` (0.875rem), font-normal, line-height: 1.25rem
- **Caption**: `text-xs` (0.75rem), font-normal, line-height: 1rem

### Container Widths
- **Max Container**: `max-w-screen-xl` (1280px) - Main content areas
- **Content Container**: `max-w-screen-2xl` (1536px) - Full-width sections
- **Card Container**: `max-w-md` to `max-w-2xl` - Cards and forms
- **Narrow Container**: `max-w-sm` to `max-w-md` - Sidebars, forms

### Spacing Conventions
- **Section Padding**: `py-12 md:py-24` (vertical), `px-4 md:px-6` (horizontal)
- **Card Padding**: `p-4` to `p-6`
- **Element Gaps**: `gap-4` (16px) for cards, `gap-6` (24px) for sections
- **Input Padding**: `px-4 py-2.5` or `px-3 py-2`

## 4. Legal Cautions

### ⚠️ What to Avoid

1. **Exact Color Values**: Don't copy exact hex codes. Use inspiration but create your own palette derived from their orange/fire theme.

2. **Brand Assets**: 
   - **DO NOT** use ShopGarage's logo, icons, or imagery
   - **DO NOT** copy their exact brand name or taglines
   - Create your own visual identity inspired by their style

3. **Exact Code/HTML Structure**: 
   - Don't copy their HTML structure or component architecture
   - Use their design patterns as inspiration, not templates

4. **Font Choices**: 
   - They likely use custom fonts - use system fonts or Google Fonts equivalents
   - Don't embed their font files

5. **Exact Spacing/Measurements**: 
   - Use proportional spacing (4px base) but don't copy exact pixel values
   - Create your own rhythm

6. **Copyrighted Content**:
   - Don't copy testimonials, descriptions, or any written content
   - Don't use their product images or photos

### ✅ Safe Practices

- **Design Patterns**: OK to use similar layout patterns (hero sections, card grids)
- **Color Inspiration**: OK to use similar color schemes (orange/neutral palette)
- **Typography Scale**: OK to use similar size relationships
- **Spacing Rhythm**: OK to use similar proportional spacing
- **Component Patterns**: OK to create similar UI patterns (buttons, cards) with your own code

### 📝 Notes

- The design system is **inspired by** ShopGarage, not copied from it
- All components use original code with Tailwind classes
- Color palette uses industry-standard orange/neutral combinations
- Typography uses system fonts for performance and accessibility
- Spacing follows Tailwind's default 4px base scale

