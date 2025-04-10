/**
 * Configuration for Cognitive Task Application (React Version)
 */

// Task Configuration
export const TASK_CONFIG = {
  // Object Span Task Config
  objectSpan: {
    minSpan: 3,           // Starting span length
    maxSpan: 9,           // Maximum span length
    displayTime: 1000,     // Time each object is displayed (ms)
    blankTime: 1000,       // Time between objects (ms)
    mainTaskRounds: 8,     // Number of rounds in the main task
    objectMapping: {
      1: { name: 'bread', image: '/images/Bread.png' },
      2: { name: 'car', image: '/images/Car.png' },
      3: { name: 'book', image: '/images/Book.png' },
      4: { name: 'bag', image: '/images/Bag.png' },
      5: { name: 'chair', image: '/images/Chair.png' },
      6: { name: 'computer', image: '/images/Computer.png' },
      7: { name: 'money', image: '/images/Money.png' },
      8: { name: 'pot', image: '/images/Pot.png' },
      9: { name: 'shoe', image: '/images/Shoe.png' }
    }
  },
  
  // Digit Span Task Config
  digitSpan: {
    minSpan: 3,
    maxSpan: 9,
    displayTime: 1000,
    blankTime: 500
  },
  
  // Spatial Memory Task Config
  spatialMemory: {
    practice: { maxShapes: 5, displayTime: 30000 },
    real: { maxShapes: 20, displayTime: 90000 }
  }
};

// Data Format Specifications for Result Export
export const EXPORT_FORMATS = {
  objectSpan: {
    csv: {
      headers: [
        'participant_id',
        'counter_balance',
        'task_type',
        'span_mode',
        'trial_number',
        'timestamp',
        'span_length',
        'attempt_number',
        'is_correct',
        'max_span_reached',
        'total_correct_sequences'
      ],
      filename: (taskType, studentId, timestamp) => 
        `${taskType}_results_${studentId}_${timestamp}.csv`
    }
  },
  
  digitSpan: {
    csv: {
      headers: [
        'participant_id',
        'counter_balance',
        'task_type',
        'span_mode',
        'trial_number',
        'timestamp',
        'span_length',
        'attempt_number',
        'is_correct',
        'max_span_reached'
      ],
      filename: (taskType, studentId, timestamp) => 
        `${taskType}_results_${studentId}_${timestamp}.csv`
    }
  }
};

// Utility Functions 
export const UTILS = {
  // Format timestamp for filenames
  formatTimestamp: () => {
    const now = new Date();
    return now.getFullYear() + 
      String(now.getMonth() + 1).padStart(2, '0') + 
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') + 
      String(now.getMinutes()).padStart(2, '0');
  },
  
  // Convert a JS object to CSV string
  objectToCSV: (headers, dataRows) => {
    const csvHeader = headers.join(',');
    const csvRows = dataRows.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? 
        `"${value}"` : value
      ).join(',')
    );
    return [csvHeader, ...csvRows].join('\n');
  },
  
  // Download data as a CSV file
  downloadCSV: (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}; 