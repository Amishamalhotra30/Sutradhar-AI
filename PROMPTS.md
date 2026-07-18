# PROMPTS.md

# AI Prompt Log

This document records the prompt variations tested for the AI Heritage Story Generator implemented in **Sutradhar AI**.

---

# Prompt Variation 1

## Prompt

```
Generate a heritage story using the following information:

Craft Name: {craft_name}
State: {state}
Artisan Name: {artisan_name}
Speciality: {speciality}
```

### Example Input

- Craft Name: Pashmina Shawl
- State: Jammu & Kashmir
- Artisan Name: Abdul Rahman
- Speciality: Handwoven Wool Shawls

### Example Output

A short heritage story describing the craft and its cultural importance.

### Observation

The generated story was accurate but relatively brief and lacked details about the artisan and traditional craftsmanship.

---

# Prompt Variation 2

## Prompt

```
Generate an engaging heritage story for the following Indian handicraft.

Include:
- Historical background
- Cultural significance
- Traditional craftsmanship
- Contribution of the artisan

Craft Name: {craft_name}
State: {state}
Artisan Name: {artisan_name}
Speciality: {speciality}
```

### Example Input

- Craft Name: Pashmina Shawl
- State: Jammu & Kashmir
- Artisan Name: Abdul Rahman
- Speciality: Handwoven Wool Shawls

### Example Output

A detailed story describing the history of Pashmina weaving, the artisan's role, and its cultural significance.

### Observation

This version produced richer and more informative stories compared to Prompt Variation 1.

---

# Prompt Variation 3 (Final Prompt)

## Prompt

```
Generate a culturally rich and engaging heritage story for an Indian handicraft using the following details:

Craft Name: {craft_name}
State: {state}
Artisan Name: {artisan_name}
Speciality: {speciality}

The story should:

- Explain the historical background of the craft.
- Highlight its cultural significance.
- Mention the artisan's contribution.
- Describe the traditional craftsmanship involved.
- Maintain a professional, inspiring, and educational tone.
- Keep the story between 250 and 400 words.
```

### Example Input

- Craft Name: Pashmina Shawl
- State: Jammu & Kashmir
- Artisan Name: Abdul Rahman
- Speciality: Handwoven Wool Shawls

### Example Output

A comprehensive heritage story describing the origin of Pashmina weaving, the artisan's expertise, the traditional weaving process, and the cultural importance of preserving Indian handicrafts.

### Observation

This prompt consistently generated the most detailed, coherent, and culturally rich responses. The stories were well-structured, highlighted both the historical and artistic aspects of the craft, and required minimal post-processing. It was selected as the final prompt used in the application.

---

# System Prompt

No separate system prompt or role-based instruction was used. The application sends a single structured user prompt directly to the Google Gemini model.

---

# Final Prompt Used in the Application

The final implementation uses **Prompt Variation 3** because it produces informative, engaging, and consistent heritage stories while maintaining an educational and professional tone.