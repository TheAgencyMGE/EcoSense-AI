import { SessionTracker, ExportReport, PersonalizedRecommendations, ActionPlan } from '@/types/environmental';
import fileDownload from 'js-file-download';

export class ReportExporter {
  static generateReport(session: SessionTracker): ExportReport {
    const sessionSummary = {
      totalAnalyses: session.analyses.length,
      averageSustainabilityScore: Math.round(
        session.analyses.reduce((sum, a) => sum + a.sustainabilityScore.score, 0) / session.analyses.length
      ),
      totalCarbonImpact: Math.round(
        session.analyses.reduce((sum, a) => sum + a.carbonFootprint.amount, 0) * 100
      ) / 100,
      potentialReduction: Math.round(session.totalImpactReduction),
      topCategories: this.getTopCategories(session)
    };

    const recommendations = this.generatePersonalizedRecommendations(session);
    const actionPlan = this.generateActionPlan(session);

    return {
      sessionSummary,
      analyses: session.analyses,
      recommendations,
      actionPlan,
      generatedAt: new Date().toISOString()
    };
  }

  static exportAsPDF(session: SessionTracker): void {
    const report = this.generateReport(session);
    const htmlContent = this.generateHTMLReport(report);
    
    // Create a blob and download as HTML (for now, can be enhanced to actual PDF)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    fileDownload(blob, `EcoSense-Report-${new Date().toISOString().split('T')[0]}.html`);
  }

  static exportAsJSON(session: SessionTracker): void {
    const report = this.generateReport(session);
    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    fileDownload(blob, `EcoSense-Data-${new Date().toISOString().split('T')[0]}.json`);
  }

  static exportAsCSV(session: SessionTracker): void {
    const csvContent = this.generateCSVContent(session);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    fileDownload(blob, `EcoSense-Analysis-${new Date().toISOString().split('T')[0]}.csv`);
  }

  private static getTopCategories(session: SessionTracker): string[] {
    const categoryCount = session.analyses.reduce((acc, analysis) => {
      analysis.environmentalImpacts.forEach(impact => {
        acc[impact.category] = (acc[impact.category] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }

  private static generatePersonalizedRecommendations(session: SessionTracker): PersonalizedRecommendations {
    const allSteps = session.analyses.flatMap(a => a.actionableSteps);
    const allAlternatives = session.analyses.flatMap(a => a.ecoAlternatives);

    return {
      immediate: allSteps.filter(step => step.timeframe === 'immediate').slice(0, 3),
      shortTerm: allSteps.filter(step => step.timeframe === 'short-term').slice(0, 3),
      longTerm: allSteps.filter(step => step.timeframe === 'long-term').slice(0, 3),
      priorityAlternatives: allAlternatives
        .sort((a, b) => b.impactReduction - a.impactReduction)
        .slice(0, 5)
    };
  }

  private static generateActionPlan(session: SessionTracker): ActionPlan {
    const weeklyGoals = [
      'Track daily environmental choices',
      'Implement one easy sustainability switch',
      'Research local eco-friendly options'
    ];

    const monthlyTargets = [
      'Reduce carbon footprint by 15%',
      'Find sustainable alternatives for top 3 impact categories',
      'Connect with local environmental initiatives'
    ];

    const resourceLinks = [
      {
        title: 'EPA Carbon Footprint Calculator',
        url: 'https://www.epa.gov/carbon-footprint-calculator',
        category: 'Tools',
        description: 'Government carbon footprint calculation tool'
      },
      {
        title: 'Sustainable Living Guide',
        url: 'https://www.sustainability.org',
        category: 'Education',
        description: 'Comprehensive sustainability practices guide'
      }
    ];

    return {
      weeklyGoals,
      monthlyTargets,
      resourceLinks,
      trackingMetrics: ['Carbon footprint', 'Sustainability score', 'Alternatives implemented']
    };
  }

  private static generateHTMLReport(report: ExportReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoSense AI Environmental Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #2d4a3e;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f0f9f5, #e8f5e8);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #22c55e;
        }
        .section {
            background: white;
            margin: 20px 0;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .analysis-item {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .score-bar {
            width: 100%;
            height: 20px;
            background: #f3f4f6;
            border-radius: 10px;
            overflow: hidden;
        }
        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e);
            transition: width 0.3s ease;
        }
        ul {
            padding-left: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌍 EcoSense AI Environmental Report</h1>
        <p>Generated on ${new Date(report.generatedAt).toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h2>📊 Session Summary</h2>
        <div class="summary-grid">
            <div class="metric-card">
                <div class="metric-value">${report.sessionSummary.totalAnalyses}</div>
                <div>Analyses Completed</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${report.sessionSummary.averageSustainabilityScore}</div>
                <div>Avg Sustainability Score</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${report.sessionSummary.totalCarbonImpact}</div>
                <div>kg CO₂e Impact</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${report.sessionSummary.potentialReduction}%</div>
                <div>Potential Reduction</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>🔍 Environmental Analyses</h2>
        ${report.analyses.map(analysis => `
            <div class="analysis-item">
                <h3>${analysis.inputDescription}</h3>
                <p><strong>Type:</strong> ${analysis.inputType}</p>
                <p><strong>Carbon Footprint:</strong> ${analysis.carbonFootprint.amount} ${analysis.carbonFootprint.unit}</p>
                <p><strong>Sustainability Score:</strong> ${analysis.sustainabilityScore.score}/100</p>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${analysis.sustainabilityScore.score}%"></div>
                </div>
                <p><strong>Key Insights:</strong> ${analysis.educationalInsights}</p>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>💡 Personalized Recommendations</h2>
        
        <h3>Immediate Actions</h3>
        <ul>
            ${report.recommendations.immediate.map(step => `<li>${step.step} - ${step.impact}</li>`).join('')}
        </ul>

        <h3>Short-term Goals</h3>
        <ul>
            ${report.recommendations.shortTerm.map(step => `<li>${step.step} - ${step.impact}</li>`).join('')}
        </ul>

        <h3>Long-term Targets</h3>
        <ul>
            ${report.recommendations.longTerm.map(step => `<li>${step.step} - ${step.impact}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h2>🎯 Action Plan</h2>
        
        <h3>Weekly Goals</h3>
        <ul>
            ${report.actionPlan.weeklyGoals.map(goal => `<li>${goal}</li>`).join('')}
        </ul>

        <h3>Monthly Targets</h3>
        <ul>
            ${report.actionPlan.monthlyTargets.map(target => `<li>${target}</li>`).join('')}
        </ul>

        <h3>Helpful Resources</h3>
        <ul>
            ${report.actionPlan.resourceLinks.map(link => `
                <li><a href="${link.url}" target="_blank">${link.title}</a> - ${link.description}</li>
            `).join('')}
        </ul>
    </div>

    <div class="footer">
        <p>Report generated by EcoSense AI - Making sustainability accessible through artificial intelligence</p>
        <p>Continue your eco-journey at ecosense-ai.app</p>
    </div>
</body>
</html>
    `;
  }

  private static generateCSVContent(session: SessionTracker): string {
    const headers = [
      'Timestamp',
      'Input Type',
      'Description',
      'Carbon Footprint (kg CO2e)',
      'Sustainability Score',
      'Top Impact Category',
      'Best Alternative',
      'Impact Reduction %'
    ];

    const rows = session.analyses.map(analysis => {
      const topImpact = analysis.environmentalImpacts.reduce((prev, current) => 
        current.severity > prev.severity ? current : prev, analysis.environmentalImpacts[0]
      );
      
      const bestAlternative = analysis.ecoAlternatives.reduce((prev, current) => 
        current.impactReduction > prev.impactReduction ? current : prev, analysis.ecoAlternatives[0]
      );

      return [
        analysis.timestamp,
        analysis.inputType,
        `"${analysis.inputDescription.replace(/"/g, '""')}"`,
        analysis.carbonFootprint.amount,
        analysis.sustainabilityScore.score,
        topImpact?.category || 'N/A',
        bestAlternative?.name || 'N/A',
        bestAlternative?.impactReduction || 0
      ];
    });

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}