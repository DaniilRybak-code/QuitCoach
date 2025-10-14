/**
 * Conflict Resolution Service
 * Handles intelligent conflict resolution for offline data synchronization
 */

class ConflictResolutionService {
  constructor() {
    this.resolutionStrategies = {
      'server-wins': this.serverWinsStrategy.bind(this),
      'client-wins': this.clientWinsStrategy.bind(this),
      'merge': this.mergeStrategy.bind(this),
      'timestamp-based': this.timestampBasedStrategy.bind(this),
      'field-based': this.fieldBasedStrategy.bind(this)
    };
  }

  // ===== CONFLICT DETECTION =====

  detectConflict(clientData, serverData, operationType) {
    const conflicts = [];

    // Check for field-level conflicts
    for (const field in clientData) {
      if (serverData.hasOwnProperty(field)) {
        if (this.isFieldConflict(clientData[field], serverData[field], field)) {
          conflicts.push({
            field,
            clientValue: clientData[field],
            serverValue: serverData[field],
            type: this.getConflictType(clientData[field], serverData[field], field)
          });
        }
      }
    }

    // Check for structural conflicts
    if (this.hasStructuralConflict(clientData, serverData)) {
      conflicts.push({
        field: 'structure',
        clientValue: clientData,
        serverValue: serverData,
        type: 'structural'
      });
    }

    return conflicts.length > 0 ? {
      hasConflict: true,
      conflicts,
      operationType,
      timestamp: Date.now()
    } : null;
  }

  isFieldConflict(clientValue, serverValue, fieldName) {
    // Skip timestamp fields as they're expected to differ
    if (fieldName.includes('timestamp') || fieldName.includes('At')) {
      return false;
    }

    // Deep comparison for objects
    if (typeof clientValue === 'object' && typeof serverValue === 'object') {
      return JSON.stringify(clientValue) !== JSON.stringify(serverValue);
    }

    // Simple comparison for primitives
    return clientValue !== serverValue;
  }

  getConflictType(clientValue, serverValue, fieldName) {
    // Determine conflict type based on field characteristics
    if (fieldName.includes('count') || fieldName.includes('total')) {
      return 'numeric';
    } else if (fieldName.includes('date') || fieldName.includes('time')) {
      return 'temporal';
    } else if (typeof clientValue === 'boolean' && typeof serverValue === 'boolean') {
      return 'boolean';
    } else if (Array.isArray(clientValue) && Array.isArray(serverValue)) {
      return 'array';
    } else {
      return 'generic';
    }
  }

  hasStructuralConflict(clientData, serverData) {
    // Check if the data structures are fundamentally different
    const clientKeys = Object.keys(clientData);
    const serverKeys = Object.keys(serverData);
    
    // If key sets are different, it's a structural conflict
    if (clientKeys.length !== serverKeys.length) {
      return true;
    }
    
    // Check if all keys exist in both objects
    return !clientKeys.every(key => serverKeys.includes(key));
  }

  // ===== RESOLUTION STRATEGIES =====

  async resolveConflict(conflict, strategy = 'merge') {
    const resolver = this.resolutionStrategies[strategy];
    if (!resolver) {
      throw new Error(`Unknown conflict resolution strategy: ${strategy}`);
    }

    return await resolver(conflict);
  }

  serverWinsStrategy(conflict) {
    return {
      resolved: true,
      strategy: 'server-wins',
      data: conflict.serverValue,
      reason: 'Server data takes precedence'
    };
  }

  clientWinsStrategy(conflict) {
    return {
      resolved: true,
      strategy: 'client-wins',
      data: conflict.clientValue,
      reason: 'Client data takes precedence'
    };
  }

  mergeStrategy(conflict) {
    if (conflict.conflicts.length === 0) {
      return {
        resolved: true,
        strategy: 'merge',
        data: { ...conflict.serverValue, ...conflict.clientValue },
        reason: 'No field conflicts detected'
      };
    }

    // Merge field by field
    const mergedData = { ...conflict.serverValue };
    
    for (const fieldConflict of conflict.conflicts) {
      const resolution = this.resolveFieldConflict(fieldConflict);
      mergedData[fieldConflict.field] = resolution.value;
    }

    return {
      resolved: true,
      strategy: 'merge',
      data: mergedData,
      reason: 'Fields merged using intelligent resolution',
      fieldResolutions: conflict.conflicts.map(fc => ({
        field: fc.field,
        resolution: this.resolveFieldConflict(fc)
      }))
    };
  }

  timestampBasedStrategy(conflict) {
    const clientTimestamp = this.extractTimestamp(conflict.clientValue);
    const serverTimestamp = this.extractTimestamp(conflict.serverValue);

    if (clientTimestamp > serverTimestamp) {
      return this.clientWinsStrategy(conflict);
    } else {
      return this.serverWinsStrategy(conflict);
    }
  }

  fieldBasedStrategy(conflict) {
    const fieldResolutions = {};
    let hasUnresolvedConflicts = false;

    for (const fieldConflict of conflict.conflicts) {
      const resolution = this.resolveFieldConflict(fieldConflict);
      fieldResolutions[fieldConflict.field] = resolution;
      
      if (!resolution.resolved) {
        hasUnresolvedConflicts = true;
      }
    }

    if (hasUnresolvedConflicts) {
      return {
        resolved: false,
        strategy: 'field-based',
        reason: 'Some fields require manual resolution',
        fieldResolutions
      };
    }

    // Apply field resolutions
    const mergedData = { ...conflict.serverValue };
    for (const [field, resolution] of Object.entries(fieldResolutions)) {
      mergedData[field] = resolution.value;
    }

    return {
      resolved: true,
      strategy: 'field-based',
      data: mergedData,
      reason: 'All fields resolved automatically',
      fieldResolutions
    };
  }

  // ===== FIELD-LEVEL RESOLUTION =====

  resolveFieldConflict(fieldConflict) {
    const { field, clientValue, serverValue, type } = fieldConflict;

    switch (type) {
      case 'numeric':
        return this.resolveNumericConflict(field, clientValue, serverValue);
      
      case 'temporal':
        return this.resolveTemporalConflict(field, clientValue, serverValue);
      
      case 'boolean':
        return this.resolveBooleanConflict(field, clientValue, serverValue);
      
      case 'array':
        return this.resolveArrayConflict(field, clientValue, serverValue);
      
      case 'generic':
        return this.resolveGenericConflict(field, clientValue, serverValue);
      
      default:
        return {
          resolved: false,
          value: serverValue,
          reason: 'Unknown conflict type'
        };
    }
  }

  resolveNumericConflict(field, clientValue, serverValue) {
    // For numeric fields, use the maximum value (for counts, totals, etc.)
    const maxValue = Math.max(clientValue, serverValue);
    
    return {
      resolved: true,
      value: maxValue,
      reason: `Used maximum value for numeric field: ${maxValue}`
    };
  }

  resolveTemporalConflict(field, clientValue, serverValue) {
    const clientTime = new Date(clientValue).getTime();
    const serverTime = new Date(serverValue).getTime();
    
    // Use the more recent timestamp
    const latestTime = Math.max(clientTime, serverTime);
    
    return {
      resolved: true,
      value: new Date(latestTime).toISOString(),
      reason: `Used latest timestamp for temporal field`
    };
  }

  resolveBooleanConflict(field, clientValue, serverValue) {
    // For boolean fields, use OR logic (if either is true, result is true)
    const result = clientValue || serverValue;
    
    return {
      resolved: true,
      value: result,
      reason: `Used OR logic for boolean field: ${result}`
    };
  }

  resolveArrayConflict(field, clientValue, serverValue) {
    // Merge arrays and remove duplicates
    const merged = [...new Set([...clientValue, ...serverValue])];
    
    return {
      resolved: true,
      value: merged,
      reason: `Merged arrays and removed duplicates: ${merged.length} items`
    };
  }

  resolveGenericConflict(field, clientValue, serverValue) {
    // For generic conflicts, prefer client value but add metadata
    return {
      resolved: true,
      value: clientValue,
      reason: `Used client value for generic field`,
      metadata: {
        serverValue,
        conflictResolvedAt: Date.now()
      }
    };
  }

  // ===== UTILITY METHODS =====

  extractTimestamp(data) {
    if (typeof data === 'string') {
      const date = new Date(data);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    }
    
    if (typeof data === 'number') {
      return data;
    }
    
    if (data && typeof data === 'object') {
      // Look for common timestamp fields
      const timestampFields = ['timestamp', 'createdAt', 'updatedAt', 'lastModified'];
      for (const field of timestampFields) {
        if (data[field]) {
          const date = new Date(data[field]);
          if (!isNaN(date.getTime())) {
            return date.getTime();
          }
        }
      }
    }
    
    return 0;
  }

  // ===== CONFLICT ANALYSIS =====

  analyzeConflict(conflict) {
    const analysis = {
      severity: 'low',
      complexity: 'simple',
      recommendations: [],
      autoResolvable: true
    };

    // Determine severity based on conflict types
    const conflictTypes = conflict.conflicts.map(c => c.type);
    if (conflictTypes.includes('structural')) {
      analysis.severity = 'high';
      analysis.autoResolvable = false;
      analysis.recommendations.push('Manual review required for structural conflicts');
    } else if (conflictTypes.includes('temporal')) {
      analysis.severity = 'medium';
      analysis.recommendations.push('Consider timestamp-based resolution');
    }

    // Determine complexity
    if (conflict.conflicts.length > 5) {
      analysis.complexity = 'complex';
    } else if (conflict.conflicts.length > 2) {
      analysis.complexity = 'moderate';
    }

    // Add recommendations based on conflict types
    if (conflictTypes.includes('numeric')) {
      analysis.recommendations.push('Consider using maximum value for numeric fields');
    }
    
    if (conflictTypes.includes('array')) {
      analysis.recommendations.push('Merge arrays and remove duplicates');
    }

    return analysis;
  }

  // ===== CONFLICT HISTORY =====

  async logConflict(conflict, resolution) {
    const conflictLog = {
      id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conflict,
      resolution,
      timestamp: Date.now(),
      analysis: this.analyzeConflict(conflict)
    };

    // Store in IndexedDB for analysis
    try {
      const { openDB } = await import('idb');
      const db = await openDB('QuitCoachConflicts', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('conflicts')) {
            db.createObjectStore('conflicts', { keyPath: 'id' });
          }
        }
      });
      
      await db.put('conflicts', conflictLog);
    } catch (error) {
      console.warn('Could not log conflict:', error);
    }

    return conflictLog;
  }

  async getConflictHistory(limit = 100) {
    try {
      const { openDB } = await import('idb');
      const db = await openDB('QuitCoachConflicts', 1);
      const tx = db.transaction('conflicts', 'readonly');
      const store = tx.objectStore('conflicts');
      
      const conflicts = await store.getAll();
      return conflicts
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.warn('Could not retrieve conflict history:', error);
      return [];
    }
  }

  // ===== CONFLICT STATISTICS =====

  async getConflictStatistics() {
    const conflicts = await this.getConflictHistory(1000);
    
    const stats = {
      totalConflicts: conflicts.length,
      resolvedConflicts: conflicts.filter(c => c.resolution.resolved).length,
      unresolvedConflicts: conflicts.filter(c => !c.resolution.resolved).length,
      conflictTypes: {},
      resolutionStrategies: {},
      averageResolutionTime: 0
    };

    // Analyze conflict types
    conflicts.forEach(conflict => {
      conflict.conflict.conflicts.forEach(fieldConflict => {
        const type = fieldConflict.type;
        stats.conflictTypes[type] = (stats.conflictTypes[type] || 0) + 1;
      });
      
      const strategy = conflict.resolution.strategy;
      stats.resolutionStrategies[strategy] = (stats.resolutionStrategies[strategy] || 0) + 1;
    });

    // Calculate average resolution time
    const resolvedConflicts = conflicts.filter(c => c.resolution.resolved);
    if (resolvedConflicts.length > 0) {
      const totalTime = resolvedConflicts.reduce((sum, c) => {
        return sum + (c.timestamp - c.conflict.timestamp);
      }, 0);
      stats.averageResolutionTime = totalTime / resolvedConflicts.length;
    }

    return stats;
  }
}

export default ConflictResolutionService;
