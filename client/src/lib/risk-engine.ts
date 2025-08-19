import { Contract } from "@shared/schema";

export interface RiskFactor {
  name: string;
  weight: number;
  value: number;
  description: string;
}

export interface RiskAssessmentResult {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendations: string[];
}

export class RiskEngine {
  private static readonly RISK_THRESHOLDS = {
    low: 3.0,
    medium: 5.0,
    high: 7.0,
    critical: 10.0,
  };

  static assessContract(contract: Contract): RiskAssessmentResult {
    const factors = this.calculateRiskFactors(contract);
    const score = this.calculateOverallScore(factors);
    const level = this.determineRiskLevel(score);
    const recommendations = this.generateRecommendations(factors, level);

    return {
      score: Math.round(score * 10) / 10,
      level,
      factors,
      recommendations,
    };
  }

  private static calculateRiskFactors(contract: Contract): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // Contract value risk
    const valueRisk = this.assessValueRisk(Number(contract.value));
    factors.push({
      name: 'Contract Value',
      weight: 0.25,
      value: valueRisk,
      description: `Contract value of ${contract.value} ${contract.currency}`,
    });

    // Duration risk (if dates are available)
    if (contract.startDate && contract.endDate) {
      const durationRisk = this.assessDurationRisk(contract.startDate, contract.endDate);
      factors.push({
        name: 'Contract Duration',
        weight: 0.15,
        value: durationRisk,
        description: 'Risk based on contract duration',
      });
    }

    // Vendor risk (simplified - would use vendor database in real implementation)
    const vendorRisk = this.assessVendorRisk(contract.vendor);
    factors.push({
      name: 'Vendor Risk',
      weight: 0.20,
      value: vendorRisk,
      description: `Vendor: ${contract.vendor}`,
    });

    // Category risk
    const categoryRisk = this.assessCategoryRisk(contract.category);
    factors.push({
      name: 'Category Risk',
      weight: 0.15,
      value: categoryRisk,
      description: `Category: ${contract.category || 'General'}`,
    });

    // Compliance risk
    const complianceRisk = this.assessComplianceRisk(contract);
    factors.push({
      name: 'Compliance Risk',
      weight: 0.25,
      value: complianceRisk,
      description: 'Risk based on compliance requirements',
    });

    return factors;
  }

  private static assessValueRisk(value: number): number {
    // Higher values = higher risk
    if (value >= 1000000) return 8;
    if (value >= 500000) return 6;
    if (value >= 100000) return 4;
    if (value >= 50000) return 3;
    return 2;
  }

  private static assessDurationRisk(startDate: Date, endDate: Date): number {
    const durationMonths = (new Date(endDate).getTime() - new Date(startDate).getTime()) 
      / (1000 * 60 * 60 * 24 * 30);
    
    // Longer contracts = higher risk
    if (durationMonths >= 36) return 7;
    if (durationMonths >= 24) return 5;
    if (durationMonths >= 12) return 3;
    return 2;
  }

  private static assessVendorRisk(vendor: string): number {
    // In a real implementation, this would check vendor database
    // For now, return moderate risk for unknown vendors
    const knownReliableVendors = ['Microsoft', 'IBM', 'Oracle', 'SAP'];
    if (knownReliableVendors.some(v => vendor.toLowerCase().includes(v.toLowerCase()))) {
      return 2;
    }
    return 5; // Unknown vendor = moderate risk
  }

  private static assessCategoryRisk(category?: string): number {
    const riskByCategory: Record<string, number> = {
      'IT Infrastructure': 6,
      'Software License': 4,
      'Construction': 8,
      'Consulting': 5,
      'Office Supplies': 2,
      'Maintenance': 4,
      'Security': 7,
      'General': 3,
    };

    return riskByCategory[category || 'General'] || 5;
  }

  private static assessComplianceRisk(contract: Contract): number {
    // In a real implementation, this would check against compliance rules
    // For now, assess based on contract status and missing information
    let risk = 3; // Base risk

    if (contract.status === 'draft') risk += 2;
    if (!contract.startDate || !contract.endDate) risk += 1;
    if (!contract.category) risk += 1;

    return Math.min(risk, 8);
  }

  private static calculateOverallScore(factors: RiskFactor[]): number {
    const weightedSum = factors.reduce((sum, factor) => {
      return sum + (factor.value * factor.weight);
    }, 0);

    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
    
    return weightedSum / totalWeight;
  }

  private static determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= this.RISK_THRESHOLDS.high) return 'critical';
    if (score >= this.RISK_THRESHOLDS.medium) return 'high';
    if (score >= this.RISK_THRESHOLDS.low) return 'medium';
    return 'low';
  }

  private static generateRecommendations(factors: RiskFactor[], level: string): string[] {
    const recommendations: string[] = [];

    // High-risk factors
    const highRiskFactors = factors.filter(f => f.value >= 6);
    
    if (highRiskFactors.some(f => f.name === 'Contract Value')) {
      recommendations.push('Consider additional approval layers due to high contract value');
      recommendations.push('Implement enhanced monitoring and milestone tracking');
    }

    if (highRiskFactors.some(f => f.name === 'Vendor Risk')) {
      recommendations.push('Conduct thorough vendor due diligence');
      recommendations.push('Consider performance bonds or guarantees');
    }

    if (highRiskFactors.some(f => f.name === 'Category Risk')) {
      recommendations.push('Apply category-specific compliance checks');
      recommendations.push('Involve subject matter experts in review process');
    }

    if (level === 'critical' || level === 'high') {
      recommendations.push('Require senior management approval');
      recommendations.push('Implement weekly progress monitoring');
      recommendations.push('Consider legal review for all amendments');
    }

    if (recommendations.length === 0) {
      recommendations.push('Standard monitoring procedures apply');
      recommendations.push('Regular milestone reviews recommended');
    }

    return recommendations;
  }
}
