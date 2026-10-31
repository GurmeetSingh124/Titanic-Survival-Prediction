# Presentation source

`create_deck.cjs` generates the simplified 8-slide editable PowerPoint using the bundled PptxGenJS runtime. It expects the project root and the included assets (`static/images/titanic-dawn.png` plus the three website screenshots in this folder).

To regenerate:

1. Run `create_deck.cjs` with the bundled Codex Node runtime and PptxGenJS dependency.
2. Run `repair_pptx_masters.py` on `candidate.pptx` to repair duplicate slide-master package parts emitted by the generator.
3. The reviewed draft is `candidate.pptx`; the deliverable is `Titanic_Survival_Prediction_Invertis.pptx` in the project root.

Text, shapes, charts, and slide navigation are editable in PowerPoint. Website screenshots and the ship image are raster assets. Fill the student, ID, mentor, section, and date placeholders before presenting. The demo link points to `http://127.0.0.1:8000` and works when the FastAPI app is running locally.
