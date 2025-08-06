import React from "react";
import ArticleCard from "@/components/molecules/ArticleCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ArticleGrid = ({ 
  articles, 
  loading, 
  error, 
  onArticleClick, 
  onArticleEdit, 
  onArticleDelete,
  showActions = false,
  emptyTitle,
  emptyDescription,
  onRetry
}) => {
  if (loading) {
    return <Loading type="article" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!articles || articles.length === 0) {
    return (
      <Empty 
        title={emptyTitle || "아티클이 없습니다"}
        description={emptyDescription || "새로운 아티클을 작성해보세요"}
        icon="FileText"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.Id}
          article={article}
          onClick={() => onArticleClick?.(article)}
          onEdit={() => onArticleEdit?.(article)}
          onDelete={() => onArticleDelete?.(article)}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default ArticleGrid;