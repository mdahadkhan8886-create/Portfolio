/**
 * AHAD KHAN // INTERACTIVE LINUX CLI TERMINAL
 * Authentic shell emulator with commands, history, auto-complete & secret easter eggs
 */

(function () {
  const terminalBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('term-input');
  const quickPills = document.querySelectorAll('.cmd-pill');

  if (!terminalBody || !termInput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: `Available commands:
  • <span style="color:var(--accent-orange)">whoami</span>       : Executive summary & bio
  • <span style="color:var(--accent-orange)">academics</span>    : ISC Class 10th & 12th Board achievements & CS marks
  • <span style="color:var(--accent-orange)">skills</span>       : Core languages (Python, Java), Linux, Web Dev & roadmap
  • <span style="color:var(--accent-orange)">roadmap</span>      : Current learning & future frontiers (ML, Full-Stack)
  • <span style="color:var(--accent-orange)">passions</span>     : Football, Video Editing, Competitive Math & AI
  • <span style="color:var(--accent-orange)">football</span>     : Interactive pitch profile & penalty shot minigame
  • <span style="color:var(--accent-orange)">neofetch</span>     : System specification & developer info
  • <span style="color:var(--accent-orange)">math</span>         : Competitive mathematics & puzzle challenge
  • <span style="color:var(--accent-orange)">contact</span>      : Communication channels & links
  • <span style="color:var(--accent-orange)">clear</span>        : Clear the terminal console`,

    whoami: `<span style="color:var(--accent-orange); font-weight:bold;">AHAD KHAN</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role      : Computer Science Scholar & Aspiring Full-Stack / ML Engineer
Board     : ISC / ICSE School Graduate
Focus     : Algorithmic Logic, Core Systems (Java & Python), AI Exploration
Strengths : High analytical capacity, competitive math, video editing rhythm, athletic drive
Status    : <span style="color:var(--accent-green)">● Active & Building Future Tech</span>`,

    academics: `<span style="color:var(--accent-orange); font-weight:bold;">ACADEMIC EXCELLENCE // ISC / ICSE BOARDS</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[+] <span style="color:#ffffff; font-weight:bold;">CLASS 12th (ISC Board):</span>
    • Aggregate Score  : <span style="color:var(--accent-orange); font-weight:bold;">91.25%</span>
    • Computer Science : <span style="color:var(--accent-green); font-weight:bold;">98 / 100</span> (Distinction in Java OOP, Recursion, Trees & Algorithms)

[+] <span style="color:#ffffff; font-weight:bold;">CLASS 10th (ICSE Board):</span>
    • Aggregate Score  : <span style="color:var(--accent-orange); font-weight:bold;">89.80%</span>
    • Computer Science : <span style="color:var(--accent-green); font-weight:bold;">96 / 100</span> (Foundations of Programming, Logic & Flowcharts)

Summary: Unbroken track record of elite computational and analytical problem-solving.`,

    scores: `Shortcuts to Board Scores:
  • Class 12th Board : 91.25% (Computer Science: 98/100)
  • Class 10th Board : 89.80% (Computer Science: 96/100)`,

    skills: `<span style="color:var(--accent-orange); font-weight:bold;">TECH ARSENAL & TOOLING</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] CORE WEAPONS (Mastered):
    • <span style="color:#38bdf8">Python</span>   : Scripting, Data Structures, Algorithmic Automation, AI toolkits
    • <span style="color:#fb923c">Java</span>     : Strict OOP, ISC 98/100, Design Patterns, Robust Architecture
    • <span style="color:#a3e635">Linux CLI</span>: Shell navigation, permissions, bash scripts, process handling

[2] CURRENTLY MASTERING:
    • HTML5 / CSS3 / Modern Web Layouts & Dynamic Responsive UI
    • Modern Vanilla JavaScript & DOM manipulation

[3] HORIZON ROADMAP:
    • Machine Learning & Neural Network Parameter Optimization
    • Full-Stack Systems (FastAPI / Spring Boot + React + Databases)`,

    roadmap: `<span style="color:var(--accent-cyan); font-weight:bold;">LEARNING TIMELINE & ROADMAP</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Phase 1] Core Rigor      : Java (98/100) + Python + Linux CLI      [COMPLETE]
  [Phase 2] Web Foundations : HTML5, CSS3, Modern Frontend & Interactivity [IN PROGRESS]
  [Phase 3] Full-Stack Eng  : RESTful Backends + Modern Databases       [UPCOMING]
  [Phase 4] Machine Learning: Deep Learning, Transformer Parameters, LLMs [UPCOMING]`,

    passions: `<span style="color:var(--accent-orange); font-weight:bold;">CORE PASSIONS & CREATIVE DIMENSIONS</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚽ <span style="color:#ffffff; font-weight:bold;">Football</span>:
     Competed at District Level and selected for the State Level Team!
     Attacking playmaker & winger; tactical spatial awareness and split-second decisions.
  
  🎬 <span style="color:#ffffff; font-weight:bold;">Video Editing</span>:
     Cinematic visual storytelling, beat-synced rhythm, micro-pacing, and color grading.
  
  📐 <span style="color:#ffffff; font-weight:bold;">Competitive Mathematics</span>:
     Combinatorics, discrete puzzle solving, number patterns, and mathematical proofs.
  
  🤖 <span style="color:#ffffff; font-weight:bold;">AI Frontiers & Parameters</span>:
     Fascinated by emergent agentic behavior, fine-tuning hyperparameters, and model scaling.`,

    football: `<span style="color:var(--accent-green); font-weight:bold;">[⚽ MATCHDAY TACTICS // STATE & DISTRICT LEVEL]</span>
Player Profile: District Level Competitor • Selected for State Level Team
Position      : Attacking Winger / Playmaker
      ___      _ _         _ _ 
     / __\\___ | |_| |__   __ _| | |
    / _\\ / _ \\| __| '_ \\ / _\` | | |
   / /  | (_) | |_| |_) | (_| | | |
   \\/    \\___/ \\__|_.__/ \\__,_|_|_|
   
Target: Goalkeeper is ready! Type:
  • <span style="color:var(--accent-orange)">shoot left</span>
  • <span style="color:var(--accent-orange)">shoot center</span>
  • <span style="color:var(--accent-orange)">shoot right</span>`,

    neofetch: `
  <span style="color:var(--accent-orange)">      /\\       </span>  <span style="color:var(--accent-orange)">ahad@portfolio</span>
  <span style="color:var(--accent-orange)">     /  \\      </span>  ------------------
  <span style="color:var(--accent-orange)">    /\\   \\     </span>  <span style="color:var(--accent-cyan)">OS</span>        : Arch Linux x86_64
  <span style="color:var(--accent-orange)">   /      \\    </span>  <span style="color:var(--accent-cyan)">Host</span>      : ISC Computer Science Engine
  <span style="color:var(--accent-orange)">  /   ,,   \\   </span>  <span style="color:var(--accent-cyan)">Uptime</span>    : Infinite Curiosity
  <span style="color:var(--accent-orange)"> /   |  |  -\\  </span>  <span style="color:var(--accent-cyan)">Languages</span> : Python, Java, Bash, HTML/CSS
 <span style="color:var(--accent-orange)">/_-''    ''-_\\</span>  <span style="color:var(--accent-cyan)">Hobbies</span>   : Football, Video Editing, Math
                 <span style="color:var(--accent-cyan)">Memory</span>    : High Algorithmic Retention
`,

    math: `<span style="color:#f59e0b; font-weight:bold;">[COMPETITIVE MATHEMATICS CHALLENGE]</span>
Solve this quick sequence puzzle:
What is the next number: 2, 3, 5, 7, 11, 13, 17, ___ ?
Hint: All elements are prime numbers!
Type: <span style="color:var(--accent-orange)">math 19</span> to submit your answer!`,

    contact: `<span style="color:var(--accent-cyan); font-weight:bold;">GET IN TOUCH // AHAD KHAN</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Email   : <a href="mailto:ahadkhan.dev@gmail.com" style="color:var(--accent-orange)">ahadkhan.dev@gmail.com</a>
  • GitHub  : <a href="https://github.com" target="_blank" style="color:var(--accent-orange)">github.com/ahadkhan</a>
  • LinkedIn: <a href="https://linkedin.com" target="_blank" style="color:var(--accent-orange)">linkedin.com/in/ahadkhan</a>
  • Open for: Collaborative projects, hackathons & research inquiries`,
  };

  function appendOutput(html) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    terminalBody.insertBefore(div, terminalBody.querySelector('.term-input-row'));
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function handleCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    // Display user command in log
    appendOutput(`
      <span class="term-prompt-prefix">ahad@portfolio:</span><span class="term-path">~$</span>
      <span style="color:#ffffff;">${escapeHtml(trimmed)}</span>
    `);

    const lower = trimmed.toLowerCase();
    const parts = lower.split(' ');
    const cmd = parts[0];

    // Play subtle audio if enabled
    if (window.PortfolioAudio && window.PortfolioAudio.playClick) {
      window.PortfolioAudio.playClick();
    }

    // Special command cases
    if (cmd === 'clear') {
      const inputRow = terminalBody.querySelector('.term-input-row');
      terminalBody.innerHTML = '';
      terminalBody.appendChild(inputRow);
      return;
    }

    if (cmd === 'shoot') {
      const direction = parts[1];
      if (['left', 'center', 'right'].includes(direction)) {
        const goalieChoices = ['left', 'center', 'right'];
        const goalieDive = goalieChoices[Math.floor(Math.random() * goalieChoices.length)];

        if (direction !== goalieDive) {
          appendOutput(`
            <span style="color:var(--accent-green); font-weight:bold;">⚽ GOOOOOOOAL! 🔥</span>
            You aimed ${direction}, and the goalkeeper dived ${goalieDive}!
            Clinical finish into the back of the net! Brilliant technique!
          `);
        } else {
          appendOutput(`
            <span style="color:var(--accent-orange); font-weight:bold;">🧤 SAVED BY THE KEEPER!</span>
            You aimed ${direction}, and the keeper guessed correctly! Good effort, take another shot!
          `);
        }
      } else {
        appendOutput(`Usage: <span style="color:var(--accent-orange)">shoot left</span> | <span style="color:var(--accent-orange)">shoot center</span> | <span style="color:var(--accent-orange)">shoot right</span>`);
      }
      return;
    }

    if (cmd === 'math' && parts[1]) {
      if (parts[1] === '19') {
        appendOutput(`
          <span style="color:var(--accent-green); font-weight:bold;">✓ CORRECT!</span>
          19 is the 8th prime number. Your mathematical intuition is sharp!
        `);
      } else {
        appendOutput(`<span style="color:#ef4444;">✗ Not quite. Remember: consecutive prime numbers! Try again!</span>`);
      }
      return;
    }

    if (cmd === 'cat') {
      const file = parts[1];
      if (file === 'academics.txt' || file === 'marks.txt') {
        appendOutput(COMMANDS.academics);
      } else if (file === 'skills.txt') {
        appendOutput(COMMANDS.skills);
      } else {
        appendOutput(`cat: ${escapeHtml(file || '')}: No such file. Try <span style="color:var(--accent-orange)">help</span>.`);
      }
      return;
    }

    if (cmd === 'date') {
      appendOutput(new Date().toString());
      return;
    }

    if (cmd === 'echo') {
      appendOutput(escapeHtml(trimmed.slice(5)));
      return;
    }

    // Standard lookup
    if (COMMANDS[cmd]) {
      appendOutput(COMMANDS[cmd]);
    } else {
      appendOutput(`
        <span style="color:#ef4444;">bash: ${escapeHtml(cmd)}: command not found</span>
        Type <span style="color:var(--accent-orange)">help</span> to view available system commands.
      `);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Event Listeners
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(termInput.value);
      termInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        termInput.value = commandHistory[historyIndex] || '';
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        termInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        termInput.value = '';
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = termInput.value.trim().toLowerCase();
      if (!val) return;
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(val));
      if (matches.length === 1) {
        termInput.value = matches[0];
      }
    }
  });

  // Clicking anywhere in the terminal focuses the input
  terminalBody.addEventListener('click', () => {
    termInput.focus();
  });

  // Shortcut pills
  quickPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      if (cmd) {
        termInput.value = cmd;
        handleCommand(cmd);
        termInput.value = '';
        termInput.focus();
      }
    });
  });
})();

