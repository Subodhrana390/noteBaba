import { noteTypes } from "../data";
import "../styles/Categories.scss";
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="categories">
      <h1>Explore Top Categories</h1>
      <p>
        Discover our extensive collection of college notes designed for every
        student’s needs. Dive into comprehensive semester-wise and subject-wise
        materials, enjoy the convenience of well-organized notes, and enhance
        your learning experience with our easy-to-use platform. Find the
        information you need, stay updated with the latest features, and make
        your academic journey more efficient and enjoyable.
      </p>

      <div className="categories_list">
        {noteTypes?.map((category, index) => (
          <Link to={`/category/${category.name}`} key={index}>
            <div className="category" key={index}>
              <img src={category.img} alt={category.label} />
              <div className="overlay"></div>
              <div className="category_text">
                <div className="category_text_icon">{category.icon}</div>
                <p>{category.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
