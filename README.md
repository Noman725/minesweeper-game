# 💣 Minesweeper Game

A classic Minesweeper game built with vanilla JavaScript, HTML, and CSS. Features three difficulty levels, timer, flag system, and responsive design.

![Minesweeper Game](https://img.shields.io/badge/Game-Minesweeper-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Play Now

[**Play the Game Here**](https://noman725.github.io/minesweeper-game/)


## ✨ Features

- 🎯 **Three Difficulty Levels**: Easy (9×9), Medium (16×16), Hard (16×30)
- ⏱️ **Timer**: Track your solving speed
- 🚩 **Flag System**: Right-click to mark suspected mines
- 🛡️ **Safe First Click**: Mines are placed after your first click
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Classic UI**: Traditional Minesweeper look and feel

## 🚀 How to Play

1. **Left Click**: Reveal a cell
2. **Right Click**: Place or remove a flag
3. **Goal**: Reveal all non-mine cells without hitting a mine
4. **Numbers**: Show how many mines are in adjacent cells (8 directions)

## 🛠️ Technologies Used

- **HTML5**: Structure and layout
- **CSS3**: Styling with Grid and Flexbox
- **Vanilla JavaScript**: Game logic and interactions
- No frameworks or libraries required!

## 📦 Installation & Setup

### Play Locally

1. Clone the repository:
```bash
git clone https://github.com/Noman725/minesweeper-game.git
```

2. Navigate to the project folder:
```bash
cd minesweeper-game
```

3. Open `index.html` in your browser:
   - Double-click the file, or
   - Use a local server (optional)

### Deploy to GitHub Pages

1. Go to **Settings** → **Pages**
2. Select **main** branch as source
3. Click **Save**
4. Your game will be live at `https://YOUR-USERNAME.github.io/minesweeper-game/`

## 🎯 Game Rules

- The board is divided into cells with mines randomly distributed
- Click a cell to reveal it
- If you reveal a mine, you lose
- Numbers indicate how many mines are in the 8 surrounding cells
- Flag cells you think contain mines (right-click)
- Reveal all non-mine cells to win

## 🧮 Difficulty Settings

| Level  | Grid Size | Mines | Density |
|--------|-----------|-------|---------|
| Easy   | 9 × 9     | 10    | 12.3%   |
| Medium | 16 × 16   | 40    | 15.6%   |
| Hard   | 16 × 30   | 99    | 20.6%   |

## 📂 Project Structure

```
minesweeper-game/
│
├── index.html          # Main HTML file
├── style.css           # All styling
├── script.js           # Game logic
└── README.md           # This file
```

## 🔧 Customization

Want to modify the game? Here are some quick tweaks:

### Change Colors
Edit the gradient in `style.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add New Difficulty
In `script.js`, add to the `DIFFICULTIES` object:
```javascript
expert: { rows: 20, cols: 40, mines: 150 }
```

### Adjust Cell Size
In `style.css`:
```css
.cell {
    width: 30px;
    height: 30px;
}
```

## 🧠 Key Algorithms

- **Flood Fill**: Recursively reveals connected empty cells
- **Mine Generation**: Random placement with first-click protection
- **Neighbor Counting**: Calculates adjacent mines for each cell
- **Win Detection**: Checks if all safe cells are revealed

## 📱 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Mobile browsers

## 📝 Future Enhancements

- [ ] Sound effects
- [ ] High score leaderboard
- [ ] Custom theme selector
- [ ] Hint system
- [ ] Undo functionality
- [ ] Statistics tracking

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Muhammad Nouman**
- GitHub: [@Noman725](https://github.com/YOUR-USERNAME)

## 🙏 Acknowledgments

- Classic Minesweeper game by Microsoft
- Inspired by the original Windows 95 version

---

⭐ **Star this repo if you enjoyed the game!** ⭐

Made with ❤️ and JavaScript
