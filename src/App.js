import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

const App = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function onSelect(friend) {
    setSelectedFriend(friend);
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friend
          friends={friends}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <AddFriendList onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && <SplitBillForm selectedFriend={selectedFriend} />}
    </div>
  );
};

const Friend = ({ friends, onSelect, selectedFriend }) => {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <FriendList
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
};

const FriendList = ({ friend, onSelect, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">{`${friend.name} owes you $${friend.balance}`}</p>
      )}
      {friend.balance < 0 && (
        <p className="red">{`${friend.name} owes you $${Math.abs(
          friend.balance
        )}`}</p>
      )}
      {friend.balance === 0 && <p>{`${friend.name} and You are even`}</p>}

      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const AddFriendList = ({ onAddFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function onSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}/${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={onSubmit}>
      <label>👫 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.image)}
      />

      <Button>Add</Button>
    </form>
  );
};

const SplitBillForm = ({ selectedFriend }) => {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill - userExpense;
  const [billChester, setBillChester] = useState("user");

  return (
    <form className="form-split-bill">
      <h2>Spilt the Bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👩 Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? bill : Number(e.target.value)
          )
        }
      />

      <label>👫 {selectedFriend.name} expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>😈 Who's paying the bill?</label>
      <select
        value={billChester}
        onChange={(e) => setBillChester(e.target.value)}
      >
        <option value="user">YOU</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split</Button>
    </form>
  );
};

export default App;
