import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <p>lsm home</p>

      <nav>
        <Link to="/ar">ar list</Link>
        {" | "}
        <Link to="/register">register</Link>
      </nav>
    </div>
  );
}

export default Home;
