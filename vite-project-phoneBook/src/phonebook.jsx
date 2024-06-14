import { useState, useEffect } from "react";
import PhoneBookService from "./service/phoneBookService.js";

const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const List = ({ list, func }) => {
  return (
    <>
      {list.map((v) => {
        return (
          <>
            <p>
              {v.name} {v.number}
            </p>
            <button
              onClick={() => {
                func(v);
              }}
            >
              Delete
            </button>
          </>
        );
      })}
    </>
  );
};

const AppPhoneBook = () => {
  let [person, newPerson] = useState([]);
  let [personInput, newPersonInput] = useState("");
  let [numberInput, newNumberInput] = useState("");
  let [filterInput, newFilterInput] = useState("");

  let filteredPerson = person.filter((v) => {
    return v.name.includes(filterInput);
  });

  const inputOnchange = (e, selfunc) => {
    selfunc(e.target.value);
  };

  const deletePhoneBook = (v) => {
    PhoneBookService.deletePhoneBook(v).then((res) => {
      console.log(person);
      newPerson(
        person.filter((v) => {
          return v.id != res.data.id;
        }),
      );
      console.log("Data Deleted");
    });
  };

  useEffect(() => {
    PhoneBookService.getPhoneBook()
      .then((res) => {
        newPerson(res.data);
      })
      .catch(() => {
        console.log("Get Error");
      });
  }, []);

  return (
    <>
      <Header text="Phonebook" />
      <span>Filter by name :</span>
      <input
        onChange={(e) => {
          inputOnchange(e, newFilterInput);
        }}
      />
      <br />
      <br />
      <br />
      <Header text="Add a User" />
      <form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          let personObject = {
            name: personInput,
            number: numberInput,
            id: person.length + 1,
          };
          if (
            person.find((v) => {
              return v.name == personInput;
            })
          ) {
            if (
              confirm(
                `data with the name ${personInput} already Exist Do you want to Replace The Current Data?`,
              )
            ) {
              PhoneBookService.updatePhoneBook(
                person.filter((v) => {
                  return v.name == personInput;
                })[0],
                personObject,
              ).then((res) => {
                let replacedIndex = person.findIndex((v) => {
                  return v.name == personInput;
                });
                let updatedPerson = [...person];
                updatedPerson[replacedIndex] = res.data;
                newPerson(updatedPerson);
              });
            }
          } else {
            PhoneBookService.postPhoneBook(personObject)
              .then((res) => {
                console.log("Posted");
                newPerson(person.concat(res.data));
                console.log(person);
              })
              .catch(() => {
                console.log("Post Failed");
              });
            newNumberInput("");
            newPersonInput("");
          }
        }}
      >
        <span>Name :</span>
        <input
          onChange={(e) => {
            inputOnchange(e, newPersonInput);
          }}
        />
        <br />
        <span>Number :</span>
        <input
          onChange={(e) => {
            inputOnchange(e, newNumberInput);
          }}
        />
        <br />
        <button type="submit">Add Person</button>
      </form>
      <br />
      <br />
      <br />
      <Header text="Number" />
      <List list={filteredPerson} func={deletePhoneBook} />
    </>
  );
};

export default AppPhoneBook;
