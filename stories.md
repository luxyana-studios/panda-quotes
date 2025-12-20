User Stories (Implementation-Ready)

11️⃣ Frame the Moment (Language & Intent)

User Story
As a user,
I want the app to frame each quote as a moment of guidance,
so that the quote feels intentional rather than random.

Acceptance Criteria
• Replace the primary action button text:
• From: Shuffle
• To: Draw wisdom
• Display a short contextual line above the quote card:
• Default text: For this moment:
• The quote card must visually appear as a “received message” (unchanged layout, just copy)
• No randomness explanation or metadata is shown

Non-Goals
• No animations yet
• No quote categorization logic yet

2 Intention Step (Optional Ritual Entry)

User Story
As a user,
I want a brief intention-setting step before receiving wisdom,
so that the quote feels personally relevant.

Acceptance Criteria
• Before showing a quote, show a full-screen or modal screen with:
• Text:
“Take a breath.
Think of a question or situation.”
• Primary button: I’m ready
• Secondary option: Skip
• If skipped, the quote is shown immediately
• No text input is required
• This step must take less than 5 seconds to bypass

State Logic
• Once I’m ready is tapped, proceed to quote draw
• No quote is preloaded before confirmation

3 Slow the Experience (Pacing & Presence)

User Story
As a user,
I want the quote to appear slowly and calmly,
so that the experience feels reflective rather than rushed.

Acceptance Criteria
• After a quote is drawn:
• Quote text fades in over 1–2 seconds
• Author line fades in after quote text
• Disable the Draw wisdom button for 3 seconds after a quote appears
• Prevent multiple rapid draws
• No loading spinners or progress indicators

Non-Goals
• No sound effects
• No haptic feedback (yet)

4 Close the Ritual (Completion)

User Story
As a user,
I want a gentle way to close the interaction after reading a quote,
so that the experience feels complete.

Acceptance Criteria
• After the quote is fully visible, show a subtle action below the quote:
• Primary option: I’ll sit with this
• Tapping this:
• Keeps the quote visible
• Hides the draw button
• Displays a closing line:
“Carry this thought with you.”
• User can still exit or return later

Non-Goals
• No journaling
• No sharing

5. Return after selecting I'll sit with this:

Behavior

When the user taps “I’ll sit with this”: 1. Fade out the button 2. Keep the quote visible 3. After ~1 second, show a small, unobtrusive affordance at the bottom:
• Back to home
• or Close

This keeps:
• Ritual closure ✔
• User control ✔
• No harsh “exit app” behavior ✔

Why this works
• Divination rituals end gently
• The user decides when to leave
• No sudden context loss

UI suggestion

Bottom-center, small text button (not primary):

Close

No icon. No emphasis.
