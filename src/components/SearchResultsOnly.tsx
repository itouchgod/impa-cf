'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageCalculator } from '@/utils/pageCalculator';
import { SectionChangeHandler } from '@/types/pdf';

interface SmartSearchResult {
  page: number;
  text: string;
  index: number;
  context: string;
  sectionName: string;
  sectionPath: string;
  category: string;
}

interface SearchResultsOnlyProps {
  onPageJump?: (pageNumber: number) => void;
  onSectionChange?: SectionChangeHandler;
  currentSection?: string;
  selectedPDF?: string;
  initialSearchTerm?: string;
  preloadedTextData?: any;
  sharedSearchResults?: SmartSearchResult[];
  sharedSearchTerm?: string;
  sharedSearchMode?: 'current' | 'global';
  currentResultIndex?: number;
  onResultIndexChange?: (index: number) => void;
}

export default function SearchResultsOnly({ 
  onPageJump, 
  onSectionChange, 
  // currentSection, // eslint-disable-line @typescript-eslint/no-unused-vars
  selectedPDF, 
  // initialSearchTerm, // eslint-disable-line @typescript-eslint/no-unused-vars
  // preloadedTextData, // eslint-disable-line @typescript-eslint/no-unused-vars
  sharedSearchResults = [],
  sharedSearchTerm = '',
  // sharedSearchMode, // eslint-disable-line @typescript-eslint/no-unused-vars
  currentResultIndex = 0,
  onResultIndexChange
}: SearchResultsOnlyProps) {
  // 使用外部传入的当前结果索引，如果没有则使用内部状态
  const [internalHighlightIndex, setInternalHighlightIndex] = useState(0);
  const highlightIndex = currentResultIndex !== undefined ? currentResultIndex : internalHighlightIndex;
  
  // 使用共享的搜索结果
  const results = sharedSearchResults;
  const searchTerm = sharedSearchTerm;
  
  // 调试信息已移除，避免循环渲染

  // 按页面分组搜索结果
  const groupedResults = useMemo(() => {
    const groups = new Map<string, SmartSearchResult[]>();
    
    results.forEach(result => {
      const key = `${result.sectionPath}-${result.page}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(result);
    });
    
    return Array.from(groups.entries()).map(([key, groupResults]) => ({
      key,
      page: groupResults[0].page,
      sectionPath: groupResults[0].sectionPath,
      sectionName: groupResults[0].sectionName,
      results: groupResults,
      count: groupResults.length
    }));
  }, [results]);

  // 当搜索结果更新时，自动选中第一个结果
  const lastSearchTermRef = useRef<string>('');
  useEffect(() => {
    if (searchTerm && searchTerm !== lastSearchTermRef.current) {
      lastSearchTermRef.current = searchTerm;
      // 重置为第一个结果
      if (onResultIndexChange) {
        onResultIndexChange(0);
      } else {
        setInternalHighlightIndex(0);
      }
    }
  }, [searchTerm, onResultIndexChange]);

  // 跳转到指定结果（仅用于点击跳转）
  const goToResult = useCallback((index: number) => {
    if (index < 0 || index >= groupedResults.length) return;
    
    // 更新外部状态或内部状态
    if (onResultIndexChange) {
      onResultIndexChange(index);
    } else {
      setInternalHighlightIndex(index);
    }
    
    const result = groupedResults[index];
    const firstResult = result.results[0];
    
    if (!selectedPDF) {
      console.error('No PDF selected');
      return;
    }
    
    // 如果需要切换章节
    if (onSectionChange && firstResult.sectionPath !== selectedPDF) {
      // 获取目标章节的页码计算器
      const targetCalculator = PageCalculator.fromPath(firstResult.sectionPath);
      if (!targetCalculator) {
        console.error('Invalid section:', firstResult.sectionPath);
        return;
      }

      // 计算在目标章节中的相对页码
      const targetRelativePage = targetCalculator.getRelativePageFromResult(firstResult);
      
      
      // 切换到目标章节和页码
      onSectionChange(firstResult.sectionPath, targetRelativePage);
    } else {
      // 在当前章节内跳转
      if (onPageJump) {
        const currentCalculator = PageCalculator.fromPath(selectedPDF);
        if (!currentCalculator) {
          console.error('Invalid current section:', selectedPDF);
          return;
        }
        
        const targetPage = currentCalculator.getRelativePageFromResult(firstResult);
        
        onPageJump(targetPage);
      }
    }
  }, [groupedResults, selectedPDF, onSectionChange, onPageJump, onResultIndexChange]);

  // 导航到上一个/下一个结果
  const goToPrevious = () => {
    if (highlightIndex > 0) {
      goToResult(highlightIndex - 1);
    }
  };

  const goToNext = () => {
    if (highlightIndex < groupedResults.length - 1) {
      goToResult(highlightIndex + 1);
    }
  };

  // 去除自动跳转逻辑，只保留手动点击跳转功能

  // 如果没有搜索词，显示提示信息
  if (!searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Search for content</p>
          <p className="text-xs text-gray-400 mt-1">Use the search box above to find information</p>
        </div>
      </div>
    );
  }

  // 如果没有结果，显示无结果信息
  if (groupedResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-sm text-gray-700 font-medium">No results found, please try different keywords</p>
          <p className="text-xs text-gray-500 mt-1">Search term: &ldquo;{searchTerm}&rdquo;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 导航控制 - 桌面端显示，手机端隐藏（因为手机端有专门的标题栏） */}
      <div className="hidden lg:flex items-center justify-center px-4 py-3 bg-muted border-b border-border/30">
        <div className="flex items-center space-x-3">
          <button
            onClick={goToPrevious}
            disabled={highlightIndex === 0}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-card-foreground px-3 py-1 bg-card rounded-full shadow-sm">
            {highlightIndex + 1} / {groupedResults.length}
          </span>
          <button
            onClick={goToNext}
            disabled={highlightIndex === groupedResults.length - 1}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 搜索结果列表 - 手机端优化布局 */}
      <div className="flex-1 overflow-y-auto">
        {groupedResults.map((result, index) => (
          <div
            key={result.key}
            onClick={() => goToResult(index)}
            className={`group cursor-pointer transition-all duration-200 ${
              index === highlightIndex 
                ? 'bg-primary/15 shadow-sm' 
                : 'hover:bg-accent'
            }`}
          >
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* 页码标签 - 手机端更紧凑 */}
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center justify-center w-10 h-6 sm:w-14 sm:h-8 rounded-lg text-xs font-bold transition-all duration-200 ${
                    index === highlightIndex 
                      ? 'bg-primary/80 text-primary-foreground shadow-md' 
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/30 group-hover:text-primary'
                  }`}>
                    P{result.page}
                  </span>
                </div>
                
                {/* 章节信息 - 手机端优化文本显示 */}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    index === highlightIndex 
                      ? 'text-primary/90 font-medium' 
                      : 'text-card-foreground group-hover:text-foreground'
                  }`}>
                    {/* 手机端显示更紧凑的章节名称 */}
                    <div className="block sm:hidden">
                      {result.sectionName.length > 25 
                        ? `${result.sectionName.substring(0, 25)}...` 
                        : result.sectionName}
                    </div>
                    {/* 桌面端显示完整章节名称 */}
                    <div className="hidden sm:block truncate">
                      {result.sectionName}
                    </div>
                  </div>
                </div>
                
                {/* 匹配数量 - 手机端更小 */}
                {result.count > 1 && (
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs font-medium transition-all duration-200 ${
                      index === highlightIndex 
                        ? 'bg-primary/15 text-primary/80' 
                        : 'bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
                    }`}>
                      {result.count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}