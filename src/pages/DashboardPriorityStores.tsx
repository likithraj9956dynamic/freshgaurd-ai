import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { PriorityStoreCard } from '../components/PriorityStoreCard';
import { LoadingState } from '../components/state';
import type { Store, DetectedIssue } from '../types';
