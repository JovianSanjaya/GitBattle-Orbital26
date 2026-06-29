import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from "../components/back-btn";
import { documentationData } from "../data/documentation_panel_data";
import cat from "../assets/cat.png";
import bench from "../assets/bench.png";

const sectionOrder = [
  "Saving Work",
  "Branches",
  "Checking out",
  "Combining Work",
  "Undoing",
  "Tags",
  "Inspecting",
];

function DocumentationPanel() {
  const navigate = useNavigate();

  const sections = useMemo(
    () =>
      sectionOrder.map((section) => ({
        title: section,
        items: documentationData.filter((doc) => doc.section === section),
      })),
    []
  );

  return (
    <section className="documentation-page documentation-panel-front">
      <BackBtn />

      <h1 className="documentation-title documentation-panel-title font-press-start">
        Documentation Panel
      </h1>

      {sections.map(
        (section) =>
          section.items.length > 0 && (
            <div className="documentation-section" key={section.title}>
              <div className="documentation-section-title font-press-start">
                {section.title}
              </div>
              <div className="documentation-grid">
                {section.items.map((doc) => (
                  <button
                    key={doc.id}
                    className="documentation-card font-press-start"
                    onClick={() => navigate(`/documentation/${doc.id}`)}
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
            </div>
          )
      )}

      <div className="documentation-foreground">
        <img className="documentation-cat" src={cat} alt="cat" />
        <img
          className="documentation-bench documentation-bench-one"
          src={bench}
          alt="bench"
        />
        <img
          className="documentation-bench documentation-bench-two"
          src={bench}
          alt="bench"
        />
      </div>
    </section>
  );
}

export default DocumentationPanel;