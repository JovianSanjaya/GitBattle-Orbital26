import { useNavigate } from "react-router-dom";
import BackBtn from "../components/back-btn";
import { documentationSections } from "../data/documentation_panel_data";
import cat from "../assets/cat.png";
import bench from "../assets/bench.png";

function DocumentationPanel() {

  const navigate = useNavigate();

  return (
    <section className="documentation-page">

      <BackBtn />

      <h1 className="documentation-title font-press-start">
        Documentation Panel
      </h1>

      <div className="documentation-sections">

        {documentationSections.map((section) => (

          <section className="documentation-section" key={section.title}>

            <h2 className="documentation-section-title font-press-start">
              {section.title}
            </h2>

            <div className="documentation-grid">

              {section.items.map((doc) => (

                <button
                  key={doc.id}
                  className="documentation-card font-press-start"
                  type="button"
                  onClick={() => navigate(`/documentation/${doc.id}`)}
                >
                  {doc.title}
                </button>

              ))}

            </div>

          </section>

        ))}

      </div>

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

    </section>
  );
}

export default DocumentationPanel;
