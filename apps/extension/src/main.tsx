import { createRoot } from 'react-dom/client';
import { ExtensionRoot } from './index.js';
import './prototype.css';

const root = document.getElementById('root');
if (!root) throw new Error('Thiếu root của prototype');
createRoot(root).render(<ExtensionRoot />);
