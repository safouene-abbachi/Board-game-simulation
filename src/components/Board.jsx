import React, { useState } from 'react';
import axios from 'axios';

import Input from './Input';
const Board = () => {
  const [position, setPosition] = useState({});
  const [inputValue, setInputValue] = useState(2);
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [message, setMessage] = useState('');

  /**
   * It generates a random number of players, and assigns a random color to each player.
   */
  const generateNbrPlayers = async () => {
    const { data: id } = await axios.get(
      'http://assessment.tabit-gmbh.de/start'
    );
    setGameId(id);
    const { data } = await axios.post(
      'http://assessment.tabit-gmbh.de/players',
      {
        id,
        numberOfPlayers: inputValue,
      }
    );
    console.log(data);
    setPlayerName(data.nextPlayer.name);
    setPosition({
      ...data,

      players: data.players.map((player) => {
        return {
          ...player,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        };
      }),
    });
  };

  /**
   * "nextTurn" is a function that makes a post request to the server, and then sets the state of the
   * game to the response of the server.
   */
  const nextTurn = async () => {
    const { data } = await axios.post('http://assessment.tabit-gmbh.de/next', {
      id: gameId,
      player: playerName,
      numberOfDice: Math.floor(Math.random() * (6 - 1 + 1)) + 1,
    });
    const { fields, id, players, nextPlayer, winner } = data;

    setPosition((prevState) => {
      return {
        fields,
        id,
        nextPlayer: {
          ...nextPlayer,
          color: position.players?.filter(
            (pl) => pl.name === position.nextPlayer?.name
          )[0].color,
        },
        winner,
        players: players.map((el) => {
          return {
            ...el,
            color: prevState.players.filter((cl) => cl.name === el.name)[0]
              .color,
          };
        }),
      };
    });
    data.players.forEach((element) => {
      element.lastGamingSituation && setMessage(element.lastGamingSituation);
    });

    setPlayerName(data.nextPlayer.name);
  };

  const currentPositionColor = (players, pos) => {
    return players
      .map((player) => {
        if (player.field === pos) {
          return player.color;
        }
      })
      .filter((c) => c);
  };

  return (
    <>
      <Input inputValue={inputValue} setInputValue={setInputValue} />
      <button
        disabled={position?.players ? true : false}
        onClick={() => generateNbrPlayers()}
      >
        Select
      </button>
      <div style={{ margin: '15px' }}>
        {(position?.players ?? []).map((el) => (
          <button
            disabled={
              position?.nextPlayer['name'] !== el.name ||
              el.skipNextRound ||
              position?.winner?.name
            }
            style={{
              background: el.color,
            }}
            onClick={() => nextTurn()}
            key={el.name}
          >
            {el.name}
          </button>
        ))}
      </div>
      <h1>
        {position?.nextPlayer?.name
          ? `${position?.nextPlayer?.name}' turn`
          : position?.winner?.name
          ? `${position.winner.name} wins`
          : ' Click to start'}
      </h1>
      <h3>{message}</h3>

      <div className="container">
        {(position?.fields ?? []).map((item, i) => (
          <div
            style={{
              background: currentPositionColor(position.players, item.position),
            }}
            className="position"
            key={item.position}
          >
            {item.position}
          </div>
        ))}
      </div>
    </>
  );
};

export default Board;
