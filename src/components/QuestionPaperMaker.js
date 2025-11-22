import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const QuestionPaperMaker = () => {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [currentSemester, setCurrentSemester] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentSubjectCode, setCurrentSubjectCode] = useState('');
  const [currentProgram, setCurrentProgram] = useState('');
  const [sections, setSections] = useState([]);
  const fileInputRefs = useRef({});

  // Subject data for different programs
  const subjectData = {
    'B.E – Mechanical Engineering': [
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'PH23113', title: 'Material Science' },
      { code: 'MA23111', title: 'Matrices and Calculus' },
      { code: 'GE23111', title: 'Problem Solving and C Programming' },
      { code: 'GE23114', title: 'Electrical, Electronics and Instrumentation Engineering' }
    ],
    'B.Tech – Artificial Intelligence and Data Science': [
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'PH23111', title: 'Physics for Information Science' },
      { code: 'MA23111', title: 'Matrices and Calculus' },
      { code: 'GE23111', title: 'Problem Solving and C Programming' },
      { code: 'GE23113', title: 'Basic Electrical and Electronics Engineering' }
    ],
    'B.Tech – Computer Science and Business Systems': [
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'CY23111', title: 'Engineering Chemistry' },
      { code: 'GE23111', title: 'Problem Solving and C Programming' },
      { code: 'GE23131', title: 'Engineering Graphics' },
      { code: 'MA23111', title: 'Matrices and Calculus' }
    ],
    'B.Tech – Biotechnology': [
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'CY23111', title: 'Engineering Chemistry' },
      { code: 'AD23111', title: 'Python for Data Science' }
    ],
    'B.E – Computer Science and Engineering (CSE)': [
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'CY23111', title: 'Engineering Chemistry' },
      { code: 'GE23111', title: 'Problem Solving and C Programming' },
      { code: 'GE23131', title: 'Engineering Graphics' },
      { code: 'MA23111', title: 'Matrices and Calculus' }
    ],
    'B.Tech – Artificial Intelligence and Machine Learning (AI & ML)': [
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'CY23111', title: 'Engineering Chemistry' },
      { code: 'GE23111', title: 'Problem Solving and C Programming' },
      { code: 'GE23131', title: 'Engineering Graphics' },
      { code: 'MA23111', title: 'Matrices and Calculus' }
    ],
    'B.Tech – Electronics and Communication Engineering (ECE)': [
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'PH23112', title: 'Physics for Electronics Engineering' },
      { code: 'MA23111', title: 'Matrices and Calculus' },
      { code: 'GE23111', title: 'Problem Solving and C Programming' },
      { code: 'EC23111', title: 'Circuit Analysis' }
    ],
    'B.E – Electronics Engineering (VLSI Design & Technology)': [
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'PH23112', title: 'Physics for Electronics Engineering' },
      { code: 'MA23111', title: 'Matrices and Calculus' },
      { code: 'GE23111', title: 'Problem Solving and C Programming' },
      { code: 'EC23111', title: 'Circuit Analysis' }
    ],
    'B.E – Computer and Communication Engineering (ECE)': [
      { code: 'GE23112', title: 'Heritage of Tamils' },
      { code: 'HS23111', title: 'Communicative English' },
      { code: 'CY23111', title: 'Engineering Chemistry' },
      { code: 'GE23111', title: 'Problem Solving and C Programming' },
      { code: 'GE23131', title: 'Engineering Graphics' },
      { code: 'MA23111', title: 'Matrices and Calculus' }
    ]
  };

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Disable common print shortcuts
      if (
        (e.ctrlKey && e.key === 'p') || // Ctrl+P
        (e.metaKey && e.key === 'p') || // Cmd+P (Mac)
        (e.ctrlKey && e.key === 's') || // Ctrl+S (Save)
        (e.metaKey && e.key === 's') || // Cmd+S (Mac)
        e.key === 'PrintScreen' ||      // Print Screen
        (e.ctrlKey && e.key === 'c') || // Ctrl+C (Copy)
        (e.metaKey && e.key === 'c')    // Cmd+C (Mac)
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const categoryConfig = {
    'Cat-1': {
      sections: [
        {name: 'Unit 1 - Part A', unit: 1, part: 'A', coOptions: ['CO1'], totalMarks: 12}, // Was 10
        {name: 'Unit 1 - Part B', unit: 1, part: 'B', coOptions: ['CO1'], totalMarks: 13}, // Was 15
        {name: 'Unit 2 - Part A', unit: 2, part: 'A', coOptions: ['CO2'], totalMarks: 12}, // Was 10
        {name: 'Unit 2 - Part B', unit: 2, part: 'B', coOptions: ['CO2'], totalMarks: 13}  // Was 15
      ],
      overallTotal: 50
    },
    'Cat-2': {
      sections: [
        {name: 'Unit 3 - Part A', unit: 3, part: 'A', coOptions: ['CO3'], totalMarks: 12}, // Was 10
        {name: 'Unit 3 - Part B', unit: 3, part: 'B', coOptions: ['CO3'], totalMarks: 13}  // Was 15
      ],
      overallTotal: 25
    },
    'Cat-3': {
      sections: [
        {name: 'Unit 4 - Part A', unit: 4, part: 'A', coOptions: ['CO4'], totalMarks: 12}, // Was 10
        {name: 'Unit 4 - Part B', unit: 4, part: 'B', coOptions: ['CO4'], totalMarks: 13}, // Was 15
        {name: 'Unit 5 - Part A', unit: 5, part: 'A', coOptions: ['CO5'], totalMarks: 12}, // Was 10
        {name: 'Unit 5 - Part B', unit: 5, part: 'B', coOptions: ['CO5'], totalMarks: 13}  // Was 15
      ],
      overallTotal: 50
    }
  };

  // Map option to unit number
  const getUnitFromOption = (option) => {
    if (option.startsWith('CO')) {
      return parseInt(option.replace('CO', ''));
    }
    return null;
  };

  // Get the starting question number for Part B
  const getPartBStartNumber = (unit, category) => {
    // DOCX layout shows Part A is .1 to .6, so Part B must be .7
    return 7; // Was 6
  };

  // Initialize questions when category changes
  const initializeQuestions = (config, category) => {
    const initializedSections = config.sections.map(sec => {
      const partType = sec.part;
      // UPDATE: Default marks to match DOCX
      const defaultMarks = partType === 'A' ? 2 : 13; // Was 15
      
      let numQuestions = 0;
      
      if (partType === 'A') {
        numQuestions = 6; // UPDATE: Was 5
      } else {
        numQuestions = 1; // Stays 1
      }
      
      // Create questions
      const questions = [];
      const partBStartNumber = getPartBStartNumber(sec.unit, category);
      
      for (let i = 0; i < numQuestions; i++) {
        let questionNumber = '';
        if (partType === 'A') {
          questionNumber = `${sec.unit}.${i + 1}`; // e.g., 3.1, 3.2 ... 3.6
        } else {
          questionNumber = `${sec.unit}.${partBStartNumber}`; // e.g., 3.7
        }
        
        const newQuestion = {
          id: `question-${sec.unit}-${partType}-${i}`,
          number: questionNumber,
          content: partType === 'A' ? '' : { a: '', b: '' },
          level: partType === 'A' ? '' : '', // Default to  for both parts
          co: sec.coOptions.length === 1 ? sec.coOptions[0] : `CO${sec.unit}`, // Auto-select CO
          marks: defaultMarks,
          showKeyAnswer: false,
          keyAnswer: partType === 'A' ? '' : { a: '', b: '' }, 
          image: null
        };
        questions.push(newQuestion);
      }
      
      return {
        ...sec,
        id: `section-${sec.unit}-${sec.part}`,
        questions: questions
      };
    });
    
    setSections(initializedSections);
  };

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCurrentCategory(selectedCat);
    const config = categoryConfig[selectedCat];
    setCurrentConfig(config);
    
    if (config) {
      initializeQuestions(config, selectedCat);
    } else {
      setSections([]);
    }
  };

  const handleProgramChange = (e) => {
    const program = e.target.value;
    setCurrentProgram(program);
    
    // Reset subject when program changes
    setCurrentSubject('');
    setCurrentSubjectCode('');
  };

  const handleSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    setCurrentSubject(selectedSubject);
    
    // Find and set the subject code
    if (currentProgram && subjectData[currentProgram]) {
      const subject = subjectData[currentProgram].find(sub => sub.title === selectedSubject);
      if (subject) {
        setCurrentSubjectCode(subject.code);
      } else {
        setCurrentSubjectCode('');
      }
    }
  };

  const updateQuestion = (sectionId, questionId, field, value) => {
    setSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === sectionId) {
          const updatedQuestions = section.questions.map(q => {
            if (q.id === questionId) {
              // Special handling for CO selection to update question number
              if (field === 'co') {
                const unit = section.unit;
                const optionUnit = getUnitFromOption(value);
                const partType = section.part;
                let number = q.number;
                
                if (optionUnit === unit) {
                  number = q.number; // Keep the existing number
                } else {
                  number = '??';
                }
                
                return { ...q, [field]: value, number };
              }
              
              // Special handling for content in Part B
              if (field === 'content' && section.part === 'B') {
                return { ...q, [field]: { ...q.content, ...value } };
              }
              
              // Special handling for keyAnswer in Part B
              if (field === 'keyAnswer' && section.part === 'B') {
                return { ...q, [field]: { ...q.keyAnswer, ...value } };
              }
              
              return { ...q, [field]: value };
            }
            return q;
          });
          
          return { ...section, questions: updatedQuestions };
        }
        return section;
      });
    });
  };

  const toggleKeyAnswer = (sectionId, questionId) => {
    setSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === sectionId) {
          const updatedQuestions = section.questions.map(q => {
            if (q.id === questionId) {
              return { ...q, showKeyAnswer: !q.showKeyAnswer };
            }
            return q;
          });
          return { ...section, questions: updatedQuestions };
        }
        return section;
      });
    });
  };

  const handleImageUpload = (sectionId, questionId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateQuestion(sectionId, questionId, 'image', ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateSectionTotal = (section) => {
    return section.questions.reduce((total, question) => total + (parseInt(question.marks) || 0), 0);
  };

  const calculateOverallTotal = () => {
    if (!currentConfig) return 0;
    return sections.reduce((total, section) => total + calculateSectionTotal(section), 0);
  };

  const generatePDF = () => {
    console.log("Generating PDF...");
    // 1. Get the element to print
    const element = document.getElementById('pdf-content-wrapper');
    
    // 2. Define PDF options - THIS IS THE KEY CHANGE
    const opt = {
      // [top, left, bottom, right] in inches
      // 0.75in is a good standard margin
      margin:       [0.75, 0.75, 0.75, 0.75], 
      filename:     `${currentSubject}_${currentCategory}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // 3. Run the conversion and save
    html2pdf().from(element).set(opt).save();
  };

  const generateAnswerKeyPDF = () => {
    console.log("Generating Answer Key PDF...");
    // Get the element to print
    const element = document.getElementById('pdf-answer-key-wrapper');
    
    // Define PDF options
    const opt = {
      margin:       [0.75, 0.75, 0.75, 0.75], 
      filename:     `${currentSubject || 'AnswerKey'}_${currentCategory}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // Run the conversion and save
    html2pdf().from(element).set(opt).save();
  };

  // -----------------------------------------------------------------
  // 1. THIS IS YOUR OLD 'generateDOC' FUNCTION, RENAMED
  //    It now *only* prints the question paper, with no answers.
  // -----------------------------------------------------------------
  const generateQuestionDOC = () => {
    let htmlContent = `
      <html>
      <head><title>Question Paper</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { text-align: center; }
        h2 { color: #2c3e50; }
        img { max-width: 100%; height: auto; }
        p { margin-bottom: 20px; }
      </style>
      </head>
      <body>
        <h1>Question Paper - ${currentSubject} (${currentCategory})</h1>
    `;

    sections.forEach(section => {
      htmlContent += `<h2>${section.name}</h2>`;
      
      section.questions.forEach(question => {
        const level = question.level || '';
        const co = question.co || '';
        const marks = question.marks || '';

        let content = '';
        if (section.part === 'A') {
          content = question.content;
        } else {
          content = `(a)<br>${question.content.a || ''}<br><br>(b)<br>${question.content.b || ''}`;
        }

        htmlContent += `<p><strong>Question ${question.number}</strong> (${level}, ${co}) [${marks} marks]<br><br>${content.replace(/\n/g, '<br>')}`;

        if (question.image) {
          htmlContent += `<br><img src="${question.image}" alt="Diagram for Question ${question.number}" style="max-width: 500px; height: auto;">`;
        }
        htmlContent += `</p><hr>`;
      });
    });

    htmlContent += `</body></html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // New filename
    a.download = `${currentSubject || 'QuestionPaper'}_${currentCategory}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -----------------------------------------------------------------
  // 2. NEW FUNCTION: GENERATE ANSWER KEY (DOC/HTML)
  //    This is a copy of the function above, but *adds* the key answer.
  // -----------------------------------------------------------------
  const generateAnswerKeyDOC = () => {
    let htmlContent = `
      <html>
      <head><title>Answer Key</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { text-align: center; color: #006400; }
        h2 { color: #2c3e50; }
        img { max-width: 100%; height: auto; }
        p { margin-bottom: 10px; }
        .key-answer { 
          color: #006400; 
          font-family: 'Courier New', monospace; 
          font-size: 1.1em;
          border: 1px solid #e0e0e0;
          background: #f9f9f9;
          padding: 10px;
          border-radius: 4px;
        }
      </style>
      </head>
      <body>
        <h1>Answer Key - ${currentSubject} (${currentCategory})</h1>
    `;

    sections.forEach(section => {
      htmlContent += `<h2>${section.name}</h2>`;
      
      section.questions.forEach(question => {
        // --- (Question Content) ---
        let content = '';
        if (section.part === 'A') {
          content = question.content;
        } else {
          content = `(a)<br>${question.content.a || ''}<br><br>(b)<br>${question.content.b || ''}`;
        }
        htmlContent += `<p><strong>Question ${question.number}</strong><br><br>${content.replace(/\n/g, '<br>')}</p>`;

        // --- (Key Answer Content) ---
        htmlContent += `<div class="key-answer">`;
        if (section.part === 'A') {
          htmlContent += `<strong>Key Answer:</strong><br>${question.keyAnswer.replace(/\n/g, '<br>') || 'N/A'}`;
        } else {
          htmlContent += `<strong>Key Answer (a):</strong><br>${question.keyAnswer.a.replace(/\n/g, '<br>') || 'N/A'}<br><br>`;
          htmlContent += `<strong>Key Answer (b):</strong><br>${question.keyAnswer.b.replace(/\n/g, '<br>') || 'N/A'}`;
        }
        htmlContent += `</div><hr style="margin-top: 25px;">`;
      });
    });

    htmlContent += `</body></html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // New filename
    a.download = `${currentSubject || 'AnswerKey'}_${currentCategory}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const submitAndDownload = () => {
    generatePDF();
    generateQuestionDOC();
    generateAnswerKeyPDF();
    generateAnswerKeyDOC();
  };

  return (
    <div className="question-paper-maker">
      <div className="dropdown-row">
        <select className="dropdown" id="category-select" onChange={handleCategoryChange}>
          <option>Select Category</option>
          <option>Cat-1</option>
          <option>Cat-2</option>
          <option>Cat-3</option>
        </select>
        <select className="dropdown" onChange={(e) => setCurrentSemester(e.target.value)}>
          <option value="">Select Semester</option>
          <option value="1">1</option>
        </select>
        <select className="dropdown" onChange={handleProgramChange} value={currentProgram}>
          <option value="">Select Program</option>
          {Object.keys(subjectData).map(program => (
            <option key={program} value={program}>{program}</option>
          ))}
        </select>
        <select 
          className="dropdown" 
          onChange={handleSubjectChange} 
          value={currentSubject}
          disabled={!currentProgram}
        >
          <option value="">Select Subject</option>
          {currentProgram && subjectData[currentProgram] && subjectData[currentProgram].map(subject => (
            <option key={subject.code} value={subject.title}>{subject.title} ({subject.code})</option>
          ))}
        </select>
      </div>

      {currentConfig && (
        <div id="total-marks" className="total-marks">
          <strong>Overall Total for {currentCategory}: {calculateOverallTotal()} / {currentConfig.overallTotal}</strong>
        </div>
      )}

      {sections.map(section => {
        const sectionTotal = calculateSectionTotal(section);
        return (
          <div key={section.id}>
            <div className="part-header">{section.name}</div>
            
            <div 
              id={`qa-container-${section.unit}${section.part.toLowerCase()}`}
              className="qa-container"
              data-unit={section.unit}
              data-part-type={section.part}
            >
              {section.questions.map(question => (
                <div key={question.id} className="qa-box" data-unit={section.unit}>
                  <div className="upload-container">
                    <button 
                      type="button" 
                      className="upload-btn"
                      onClick={() => fileInputRefs.current[question.id]?.click()}
                    >
                      Upload Pic
                    </button>
                    <input 
                      type="file" 
                      ref={el => fileInputRefs.current[question.id] = el}
                      className="file-input" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(section.id, question.id, e)}
                    />
                  </div>
                  
                  <label className="qa-label">
                    QA
                    <span className="question-number">Question {question.number}</span>
                  </label>
                  
                  {section.part === 'B' ? (
                    <div className="sub-questions">
                      <div className="sub-question" data-sub="a">
                        <label className="sub-label">(a)</label>
                        <textarea 
                          className="sub-textarea" 
                          placeholder="Enter sub-question (a)..."
                          value={question.content.a}
                          onChange={(e) => updateQuestion(section.id, question.id, 'content', { a: e.target.value })}
                        />
                      </div>
                      <div className="sub-question" data-sub="b">
                        <label className="sub-label">(b)</label>
                        <textarea 
                          className="sub-textarea" 
                          placeholder="Enter sub-question (b)..."
                          value={question.content.b}
                          onChange={(e) => updateQuestion(section.id, question.id, 'content', { b: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <textarea 
                      className="qa-textarea" 
                      placeholder="Enter your question and answer here..."
                      value={question.content}
                      onChange={(e) => updateQuestion(section.id, question.id, 'content', e.target.value)}
                    />
                  )}
                  
                  <div className={`key-answer-section ${question.showKeyAnswer ? 'show' : ''}`}>
                    <label className="key-answer-label">Key Answer</label>
                    {section.part === 'B' ? (
                      <div>
                        <div>
                          <label>Key Answer (a):</label>
                          <textarea 
                            className="key-answer-textarea" 
                            placeholder="Enter the key answer for (a)..."
                            value={question.keyAnswer.a}
                            onChange={(e) => updateQuestion(section.id, question.id, 'keyAnswer', { a: e.target.value })}
                          />
                        </div>
                        <div>
                          <label>Key Answer (b):</label>
                          <textarea 
                            className="key-answer-textarea" 
                            placeholder="Enter the key answer for (b)..."
                            value={question.keyAnswer.b}
                            onChange={(e) => updateQuestion(section.id, question.id, 'keyAnswer', { b: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <textarea 
                        className="key-answer-textarea" 
                        placeholder="Enter the key answer here..."
                        value={question.keyAnswer}
                        onChange={(e) => updateQuestion(section.id, question.id, 'keyAnswer', e.target.value)}
                      />
                    )}
                  </div>
                  
                  <div className="lower-row">
                    <select 
                      className="dropdown"
                      value={question.level}
                      onChange={(e) => updateQuestion(section.id, question.id, 'level', e.target.value)}
                    >
                      {section.part === 'A' ? (
                        <>
                          <option></option>
                          <option>Understand</option>
                          <option>Remember</option>
                        </>
                      ) : (
                        <>
                          <option></option>
                          <option>Understand</option>
                          <option>Remember</option>
                          <option>Apply</option>
                          <option>Analyze</option>
                        </>
                      )}
                    </select>
                    
                    <select 
                      className="dropdown co-dropdown"
                      value={question.co}
                      onChange={(e) => updateQuestion(section.id, question.id, 'co', e.target.value)}
                    >
                      <option>Select CO/Unit</option>
                      {section.coOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    
                    <input 
                      type="number" 
                      className="marks-input" 
                      placeholder="Marks" 
                      min="1" 
                      value={question.marks}
                      onChange={(e) => updateQuestion(section.id, question.id, 'marks', e.target.value)}
                    />
                    
                    <button 
                      className="key-btn" 
                      onClick={() => toggleKeyAnswer(section.id, question.id)}
                    >
                      {question.showKeyAnswer ? 'Hide Key Answer' : 'Key Answer'}
                    </button>
                  </div>
                  
                  {question.image && (
                    <img 
                      src={question.image} 
                      alt="Uploaded preview" 
                      className="image-preview" 
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="section-total">
              {section.name} Total: {sectionTotal} / {section.totalMarks}
            </div>
          </div>
        );
      })}

      {currentConfig && (
        <button className="submit-btn" onClick={submitAndDownload}>
          Submit & Download (PDF + DOC)
        </button>
      )}
      
      {/* Always visible preview */}
      {currentConfig && (
        <div className="pdf-preview-container">
          <div className="pdf-preview-section">
            <h3>Question Paper Preview</h3>
            <div className="pdf-preview-frame">
              <div id="pdf-content-wrapper-preview" className="pdf-content-wrapper-preview">
                <div className="pdf-regno-header">
                  <span>Reg. No.</span>
                  {[...Array(8)].map((_, i) => <div key={i} className="pdf-regno-box"></div>)}
                </div>

                <table className="pdf-header-table">
                  <tbody>
                    <tr>
                      <td className="pdf-header-logo-cell">
                        <img 
                          src="https://i.postimg.cc/c4DJDzsK/image.png" 
                          alt="RIT Logo" 
                          className="pdf-logo"
                        />
                      </td>
                      <td className="pdf-header-title-cell">
                        <div className="pdf-title-main">Continuous Assessment Test- {currentCategory ? currentCategory.split('-')[1] : ''}</div>
                        
                        <table className="pdf-header-details-table">
                          <tbody>
                            <tr>
                              <td><strong>Year</strong></td>
                              <td>: II</td>
                            </tr>
                            <tr>
                              <td><strong>Semester</strong></td>
                              <td>: {currentSemester}</td>
                            </tr>
                             <tr>
                              <td><strong>Programme</strong></td>
                              <td>: {currentProgram}</td>
                            </tr>
                             <tr>
                              <td><strong>Course Code</strong></td>
                              <td>: {currentSubjectCode}</td>
                            </tr>
                             <tr>
                              <td><strong>Course Title</strong></td>
                              <td>: {currentSubject}</td>
                            </tr>
                             <tr>
                              <td><strong>Question Paper Code</strong></td>
                              <td>: (To be filled by the office of COE)</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="pdf-regs-line">[Regulations 2023]</div>

                <div className="pdf-info-line">
                  <span><strong>Date:</strong> ________________</span>
                  <span>
                    <strong>Time:</strong> {currentConfig?.overallTotal === 50 ? '90 Minutes' : '45 Minutes'}
                  </span>
                  <span>
                    <strong>Maximum:</strong> {currentConfig?.overallTotal} Marks
                  </span>
                </div>
                
                <div className="pdf-body">
                  {[...new Set(sections.map(s => s.unit))].map(unit => {
                    const partASection = sections.find(s => s.unit === unit && s.part === 'A');
                    const partBSection = sections.find(s => s.unit === unit && s.part === 'B');
                    
                    return (
                      <div key={`pdf-unit-${unit}`} className="pdf-co-section">
                        <div className="pdf-co-header">
                          <strong>Course Outcome (CO) : {unit}</strong>
                          <strong>Answer ALL Questions</strong>
                        </div>
                        
                        {partASection && (
                          <div className="pdf-part-a">
                            <div className="pdf-part-title">
                              <strong>Part A [6 × 2 = 12 Marks]</strong>
                            </div>
                            <table className="pdf-q-table">
                              <thead>
                                <tr>
                                  <th>Q.NO</th>
                                  <th>QUESTION</th>
                                </tr>
                              </thead>
                              <tbody>
                                {partASection.questions.map(q => (
                                  <tr key={`pdf-q-${q.id}`}>
                                    <td className="pdf-q-number">{q.number}</td>
                                    <td className="pdf-q-content">
                                      <div dangerouslySetInnerHTML={{ __html: q.content.replace(/\n/g, '<br />') }} />
                                      {q.image && <img src={q.image} alt="Diagram" className="pdf-q-image" />}
                                    </td>
                                    <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        {partBSection && (
                          <div className="pdf-part-b">
                            <div className="pdf-part-title">
                              <strong>Part B [1 × 13 = 13 Marks]</strong>
                            </div>
                            <table className="pdf-q-table">
                              <tbody>
                                {partBSection.questions.map(q => (
                                  <React.Fragment key={`pdf-q-${q.id}`}>
                                    <tr>
                                      <td className="pdf-q-number">{q.number} (a)</td>
                                      <td className="pdf-q-content">
                                        <div dangerouslySetInnerHTML={{ __html: q.content.a.replace(/\n/g, '<br />') }} />
                                        {q.image && <img src={q.image} alt="Diagram" className="pdf-q-image" />}
                                      </td>
                                      <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                                    </tr>
                                    <tr className="pdf-q-or-row">
                                      <td className="pdf-q-number">[OR]</td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                     <tr>
                                      <td className="pdf-q-number">(b)</td>
                                      <td className="pdf-q-content">
                                        <div dangerouslySetInnerHTML={{ __html: q.content.b.replace(/\n/g, '<br />') }} />
                                      </td>
                                      <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              
                <table className="pdf-footer-table">
                  <tbody>
                    <tr>
                      <td>Name and Signature of</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td><strong>Course Faculty</strong></td>
                      <td><strong>Course Coordinator</strong></td>
                      <td><strong>Course Expert</strong></td>
                      <td><strong>HOD</strong></td>
                      <td><strong>Dean(Dept.)</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="pdf-preview-section">
            <h3>Answer Key Preview</h3>
            <div className="pdf-preview-frame">
              <div id="pdf-answer-key-wrapper-preview" className="pdf-content-wrapper-preview">
                <div className="pdf-regno-header">
                  <span>Reg. No.</span>
                  {[...Array(8)].map((_, i) => <div key={i} className="pdf-regno-box"></div>)}
                </div>

                <table className="pdf-header-table">
                  <tbody>
                    <tr>
                      <td className="pdf-header-logo-cell">
                        <img 
                          src="https://i.postimg.cc/c4DJDzsK/image.png" 
                          alt="RIT Logo" 
                          className="pdf-logo"
                        />
                      </td>
                      <td className="pdf-header-title-cell">
                        <div className="pdf-title-main">Answer Key - Continuous Assessment Test- {currentCategory ? currentCategory.split('-')[1] : ''}</div>
                        
                        <table className="pdf-header-details-table">
                          <tbody>
                            <tr>
                              <td><strong>Year</strong></td>
                              <td>: II</td>
                            </tr>
                            <tr>
                              <td><strong>Semester</strong></td>
                              <td>: {currentSemester}</td>
                            </tr>
                             <tr>
                              <td><strong>Programme</strong></td>
                              <td>: {currentProgram}</td>
                            </tr>
                             <tr>
                              <td><strong>Course Code</strong></td>
                              <td>: {currentSubjectCode}</td>
                            </tr>
                             <tr>
                              <td><strong>Course Title</strong></td>
                              <td>: {currentSubject}</td>
                            </tr>
                             <tr>
                              <td><strong>Question Paper Code</strong></td>
                              <td>: (To be filled by the office of COE)</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="pdf-regs-line">[Regulations 2023]</div>

                <div className="pdf-info-line">
                  <span><strong>Date:</strong> ________________</span>
                  <span>
                    <strong>Time:</strong> {currentConfig?.overallTotal === 50 ? '90 Minutes' : '45 Minutes'}
                  </span>
                  <span>
                    <strong>Maximum:</strong> {currentConfig?.overallTotal} Marks
                  </span>
                </div>
                
                <div className="pdf-body">
                  {[...new Set(sections.map(s => s.unit))].map(unit => {
                    const partASection = sections.find(s => s.unit === unit && s.part === 'A');
                    const partBSection = sections.find(s => s.unit === unit && s.part === 'B');
                    
                    return (
                      <div key={`pdf-ak-unit-${unit}`} className="pdf-co-section">
                        <div className="pdf-co-header">
                          <strong>Course Outcome (CO) : {unit}</strong>
                          <strong>Answer ALL Questions</strong>
                        </div>
                        
                        {partASection && (
                          <div className="pdf-part-a">
                            <div className="pdf-part-title">
                              <strong>Part A [6 × 2 = 12 Marks]</strong>
                            </div>
                            <table className="pdf-q-table">
                              <thead>
                                <tr>
                                  <th>Q.NO</th>
                                  <th>ANSWER</th>
                                
                                </tr>
                              </thead>
                              <tbody>
                                {partASection.questions.map(q => (
                                  <tr key={`pdf-ak-${q.id}`}>
                                    <td className="pdf-q-number">{q.number}</td>
                                    <td className="pdf-q-content">
                                      <div><strong>Question:</strong></div>
                                      <div dangerouslySetInnerHTML={{ __html: q.content.replace(/\n/g, '<br />') }} />
                                      {q.image && <img src={q.image} alt="Diagram" className="pdf-q-image" />}
                                      <div style={{ marginTop: '10px' }}><strong>Answer:</strong></div>
                                      <div dangerouslySetInnerHTML={{ __html: (q.keyAnswer || '').replace(/\n/g, '<br />') }} />
                                    </td>
                                    <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        {partBSection && (
                          <div className="pdf-part-b">
                            <div className="pdf-part-title">
                              <strong>Part B [1 × 13 = 13 Marks]</strong>
                            </div>
                            <table className="pdf-q-table">
                              <tbody>
                                {partBSection.questions.map(q => (
                                  <React.Fragment key={`pdf-ak-${q.id}`}>
                                    <tr>
                                      <td className="pdf-q-number">{q.number} (a)</td>
                                      <td className="pdf-q-content">
                                        <div><strong>Question (a):</strong></div>
                                        <div dangerouslySetInnerHTML={{ __html: q.content.a.replace(/\n/g, '<br />') }} />
                                        {q.image && <img src={q.image} alt="Diagram" className="pdf-q-image" />}
                                        <div style={{ marginTop: '10px' }}><strong>Answer (a):</strong></div>
                                        <div dangerouslySetInnerHTML={{ __html: (q.keyAnswer.a || '').replace(/\n/g, '<br />') }} />
                                      </td>
                                      <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                                    </tr>
                                    <tr className="pdf-q-or-row">
                                      <td className="pdf-q-number">[OR]</td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td className="pdf-q-number">(b)</td>
                                      <td className="pdf-q-content">
                                        <div><strong>Question (b):</strong></div>
                                        <div dangerouslySetInnerHTML={{ __html: q.content.b.replace(/\n/g, '<br />') }} />
                                        <div style={{ marginTop: '10px' }}><strong>Answer (b):</strong></div>
                                        <div dangerouslySetInnerHTML={{ __html: (q.keyAnswer.b || '').replace(/\n/g, '<br />') }} />
                                      </td>
                                      <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              
                <table className="pdf-footer-table">
                  <tbody>
                    <tr>
                      <td>Name and Signature of</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td><strong>Course Faculty</strong></td>
                      <td><strong>Course Coordinator</strong></td>
                      <td><strong>Course Expert</strong></td>
                      <td><strong>HOD</strong></td>
                      <td><strong>Dean(Dept.)</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden PDF content for question paper */}
      <div style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: 0, 
          width: '210mm', 
          minHeight: '297mm',
          padding: '0.75in', 
          backgroundColor: 'white',
          color: 'black',
          boxSizing: 'border-box'
        }}>
        <div id="pdf-content-wrapper">
     
          <div className="pdf-regno-header">
            <span>Reg. No.</span>
           
            {[...Array(8)].map((_, i) => <div key={i} className="pdf-regno-box"></div>)}
          </div>

          <table className="pdf-header-table">
            <tbody>
              <tr>
                <td className="pdf-header-logo-cell">
                  
                  <img 
                    src="https://i.postimg.cc/c4DJDzsK/image.png" 
                    alt="RIT Logo" 
                    className="pdf-logo"
                  />
                </td>
                <td className="pdf-header-title-cell">
                  <div className="pdf-title-main">Continuous Assessment Test- {currentCategory ? currentCategory.split('-')[1] : ''}</div>
                  
                
                  <table className="pdf-header-details-table">
                    <tbody>
                      <tr>
                        <td><strong>Year</strong></td>
                        <td>: II</td>
                      </tr>
                      <tr>
                        <td><strong>Semester</strong></td>
                        <td>: {currentSemester}</td>
                      </tr>
                       <tr>
                        <td><strong>Programme</strong></td>
                        <td>: {currentProgram}</td>
                      </tr>
                       <tr>
                        <td><strong>Course Code</strong></td>
                        <td>: {currentSubjectCode}</td>
                      </tr>
                       <tr>
                        <td><strong>Course Title</strong></td>
                        <td>: {currentSubject}</td>
                      </tr>
                       <tr>
                        <td><strong>Question Paper Code</strong></td>
                        <td>: (To be filled by the office of COE)</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="pdf-regs-line">[Regulations 2023]</div>

         
          <div className="pdf-info-line">
            <span><strong>Date:</strong> ________________</span>
            <span>
              <strong>Time:</strong> {currentConfig?.overallTotal === 50 ? '90 Minutes' : '45 Minutes'}
            </span>
            <span>
              <strong>Maximum:</strong> {currentConfig?.overallTotal} Marks
            </span>
          </div>
          
          <div className="pdf-body">
            {[...new Set(sections.map(s => s.unit))].map(unit => {
              const partASection = sections.find(s => s.unit === unit && s.part === 'A');
              const partBSection = sections.find(s => s.unit === unit && s.part === 'B');
              
              return (
                <div key={`pdf-unit-${unit}`} className="pdf-co-section">
                
                  <div className="pdf-co-header">
                    <strong>Course Outcome (CO) : {unit}</strong>
                    <strong>Answer ALL Questions</strong>
                  </div>
                  
               
                  {partASection && (
                    <div className="pdf-part-a">
                      <div className="pdf-part-title">
                        <strong>Part A [6 × 2 = 12 Marks]</strong>
                      </div>
                      <table className="pdf-q-table">
                        <thead>
                          <tr>
                            <th>Q.NO</th>
                            <th>QUESTION</th>
                            
                          </tr>
                        </thead>
                        <tbody>
                          {partASection.questions.map(q => (
                            <tr key={`pdf-q-${q.id}`}>
                              <td className="pdf-q-number">{q.number}</td>
                              <td className="pdf-q-content">
                                <div dangerouslySetInnerHTML={{ __html: q.content.replace(/\n/g, '<br />') }} />
                                {q.image && <img src={q.image} alt="Diagram" className="pdf-q-image" />}
                              </td>
                              <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {partBSection && (
                    <div className="pdf-part-b">
                       <div className="pdf-part-title">
                        <strong>Part B [1 × 13 = 13 Marks]</strong>
                      </div>
                      <table className="pdf-q-table">
                        <tbody>
                          {partBSection.questions.map(q => (
                            <React.Fragment key={`pdf-q-${q.id}`}>
                              <tr>
                                <td className="pdf-q-number">{q.number} (a)</td>
                                <td className="pdf-q-content">
                                  <div dangerouslySetInnerHTML={{ __html: q.content.a.replace(/\n/g, '<br />') }} />
                                  {q.image && <img src={q.image} alt="Diagram" className="pdf-q-image" />}
                                </td>
                                <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                              </tr>
                              <tr className="pdf-q-or-row">
                                <td className="pdf-q-number">[OR]</td>
                                <td></td>
                                <td></td>
                              </tr>
                               <tr>
                                <td className="pdf-q-number">(b)</td>
                                <td className="pdf-q-content">
                                  <div dangerouslySetInnerHTML={{ __html: q.content.b.replace(/\n/g, '<br />') }} />
                                </td>
                                <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        
          <table className="pdf-footer-table">
            <tbody>
              <tr>
                <td>Name and Signature of</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td><strong>Course Faculty</strong></td>
                <td><strong>Course Coordinator</strong></td>
                <td><strong>Course Expert</strong></td>
                <td><strong>HOD</strong></td>
                <td><strong>Dean(Dept.)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Hidden PDF content for answer key */}
      <div style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: 0, 
          width: '210mm', 
          minHeight: '297mm',
          padding: '0.75in', 
          backgroundColor: 'white',
          color: 'black',
          boxSizing: 'border-box'
        }}>
        <div id="pdf-answer-key-wrapper">
          <div className="pdf-regno-header">
            <span>Reg. No.</span>
            {[...Array(8)].map((_, i) => <div key={i} className="pdf-regno-box"></div>)}
          </div>

          <table className="pdf-header-table">
            <tbody>
              <tr>
                <td className="pdf-header-logo-cell">
                  <img 
                    src="https://i.postimg.cc/c4DJDzsK/image.png" 
                    alt="RIT Logo" 
                    className="pdf-logo"
                  />
                </td>
                <td className="pdf-header-title-cell">
                  <div className="pdf-title-main">Answer Key - Continuous Assessment Test- {currentCategory ? currentCategory.split('-')[1] : ''}</div>
                  
                  <table className="pdf-header-details-table">
                    <tbody>
                      <tr>
                        <td><strong>Year</strong></td>
                        <td>: II</td>
                      </tr>
                      <tr>
                        <td><strong>Semester</strong></td>
                        <td>: {currentSemester}</td>
                      </tr>
                       <tr>
                        <td><strong>Programme</strong></td>
                        <td>: {currentProgram}</td>
                      </tr>
                       <tr>
                        <td><strong>Course Code</strong></td>
                        <td>: {currentSubjectCode}</td>
                      </tr>
                       <tr>
                        <td><strong>Course Title</strong></td>
                        <td>: {currentSubject}</td>
                      </tr>
                       <tr>
                        <td><strong>Question Paper Code</strong></td>
                        <td>: (To be filled by the office of COE)</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="pdf-regs-line">[Regulations 2023]</div>

          <div className="pdf-info-line">
            <span><strong>Date:</strong> ________________</span>
            <span>
              <strong>Time:</strong> {currentConfig?.overallTotal === 50 ? '90 Minutes' : '45 Minutes'}
            </span>
            <span>
              <strong>Maximum:</strong> {currentConfig?.overallTotal} Marks
            </span>
          </div>
          
          <div className="pdf-body">
            {[...new Set(sections.map(s => s.unit))].map(unit => {
              const partASection = sections.find(s => s.unit === unit && s.part === 'A');
              const partBSection = sections.find(s => s.unit === unit && s.part === 'B');
              
              return (
                <div key={`pdf-ak-unit-${unit}`} className="pdf-co-section">
                  <div className="pdf-co-header">
                    <strong>Course Outcome (CO) : {unit}</strong>
                    <strong>Answer ALL Questions</strong>
                  </div>
                  
                  {partASection && (
                    <div className="pdf-part-a">
                      <div className="pdf-part-title">
                        <strong>Part A [6 × 2 = 12 Marks]</strong>
                      </div>
                      <table className="pdf-q-table">
                        <thead>
                          <tr>
                            <th>Q.NO</th>
                            <th>ANSWER</th>
                          
                          </tr>
                        </thead>
                        <tbody>
                          {partASection.questions.map(q => (
                            <tr key={`pdf-ak-${q.id}`}>
                              <td className="pdf-q-number">{q.number}</td>
                              <td className="pdf-q-content">
                                <div><strong>Question:</strong></div>
                                <div dangerouslySetInnerHTML={{ __html: q.content.replace(/\n/g, '<br />') }} />
                                {q.image && <img src={q.image} alt="Diagram" className="pdf-q-image" />}
                                <div style={{ marginTop: '10px' }}><strong>Answer:</strong></div>
                                <div dangerouslySetInnerHTML={{ __html: (q.keyAnswer || '').replace(/\n/g, '<br />') }} />
                              </td>
                              <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {partBSection && (
                    <div className="pdf-part-b">
                      <div className="pdf-part-title">
                        <strong>Part B [1 × 13 = 13 Marks]</strong>
                      </div>
                      <table className="pdf-q-table">
                        <tbody>
                          {partBSection.questions.map(q => (
                            <React.Fragment key={`pdf-ak-${q.id}`}>
                              <tr>
                                <td className="pdf-q-number">{q.number} (a)</td>
                                <td className="pdf-q-content">
                                  <div><strong>Question (a):</strong></div>
                                  <div dangerouslySetInnerHTML={{ __html: q.content.a.replace(/\n/g, '<br />') }} />
                                  {q.image && <img src={q.image} alt="Diagram" className="pdf-q-image" />}
                                  <div style={{ marginTop: '10px' }}><strong>Answer (a):</strong></div>
                                  <div dangerouslySetInnerHTML={{ __html: (q.keyAnswer.a || '').replace(/\n/g, '<br />') }} />
                                </td>
                                <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                              </tr>
                              <tr className="pdf-q-or-row">
                                <td className="pdf-q-number">[OR]</td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td className="pdf-q-number">(b)</td>
                                <td className="pdf-q-content">
                                  <div><strong>Question (b):</strong></div>
                                  <div dangerouslySetInnerHTML={{ __html: q.content.b.replace(/\n/g, '<br />') }} />
                                  <div style={{ marginTop: '10px' }}><strong>Answer (b):</strong></div>
                                  <div dangerouslySetInnerHTML={{ __html: (q.keyAnswer.b || '').replace(/\n/g, '<br />') }} />
                                </td>
                                <td className="pdf-q-bt">{q.level === 'Understand' ? 'A2' : q.level === 'Remember' ? 'A1' : q.level === 'Apply' ? 'B2' : q.level === 'Analyze' ? 'B1' : q.level.substring(0, 2).toUpperCase()}</td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        
          <table className="pdf-footer-table">
            <tbody>
              <tr>
                <td>Name and Signature of</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td><strong>Course Faculty</strong></td>
                <td><strong>Course Coordinator</strong></td>
                <td><strong>Course Expert</strong></td>
                <td><strong>HOD</strong></td>
                <td><strong>Dean(Dept.)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default QuestionPaperMaker;