import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // options is required ~ Rapid API
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY, // -->> This is the Default API key
      "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
    },
  };

  // First element from useState is the state itself (""). The initial value, in this case an empty string
  // Second is the function that will update the state (setEndPoint). The "Changer" function
  const [endPoint, setEndPoint] = useState("");
  // "Changer" function: it change the state of the endPoint variable by taking the value from the input
  const onChangeHandler = (event) => {
    setEndPoint(event.target.value);
  };

  // "Submit" function: it prevent the default behaviour of the form. It won't refresh the page
  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log("submit");
  };

  // container is an empty array. setContainer is the function that will update the state of the container
  const [container, setContainer] = useState([]);

  useEffect(() => {
    const url = `https://imdb8.p.rapidapi.com/auto-complete?q=+${endPoint}`;

    // async function:
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        // console.log(result);  // console.log(result.d);
        setContainer(result.d); // setContainer is now an array of objects that contains the data from the API
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [endPoint, options]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Rapid API</h1>
        </div>
        <form className="w-full max-w-md" onSubmit={onSubmitHandler}>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Search for a movie..."
            value={endPoint}
            onChange={onChangeHandler}
          />
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 transition duration-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Search
          </button>
        </form>
        {container.map((item) => {
          return (
            <div key={item.id} className="text-center">
              {/* <img src={item.i.imageUrl} alt={item.l} /> */}
              {/* <p>{item.l}</p> */}
              {/* <p>{item.s}</p> */}
              {/* <p>{item.i}</p> */}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
