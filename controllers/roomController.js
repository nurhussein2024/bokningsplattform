const Room = require('../models/Room');

// Skapa ett nytt rum
const createRoom = async (req, res) => {
  try {
    const { name, capacity, type } = req.body;

    // Skapa ett nytt rum
    const room = new Room({ name, capacity, type });
    await room.save();

    res.status(201).json({ message: 'Rum skapad', room });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid skapande av rum' });
  }
};

// Hämta alla rum
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid hämtning av rum' });
  }
};

// Uppdatera ett rum
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, type } = req.body;

    // Uppdatera rummet
    const room = await Room.findByIdAndUpdate(id, { name, capacity, type }, { new: true });
    if (!room) {
      return res.status(404).json({ message: 'Rum inte funnet' });
    }

    res.status(200).json({ message: 'Rum uppdaterad', room });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid uppdatering av rum' });
  }
};

// Ta bort ett rum
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Ta bort rummet
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: 'Rum inte funnet' });
    }

    res.status(200).json({ message: 'Rum borttaget' });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid borttagning av rum' });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom
};
