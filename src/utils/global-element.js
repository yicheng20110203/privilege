/**
 * 全局查询条件
 */

/**
 * 删除状态搜索
 * []: 所有 [1]:删除 [2]:有效
 */
export const ISDELETE_ALL = []
export const IS_DELETE_ALL = [1]
export const ISDELETE = [2]

/**
 * type
 * 小节类型&&素材类型
 * 1:视频 2:音频 3:文章 4:图片
 */
export const TYPE_VIDEO = 1
export const TYPE_AUDIO = 2
export const TYPE_ARTICLE = 3
export const TYPE_PICTURE = 4

/**
 * status
 *  上下架状态搜索状态
 * 	1:未上架 2:已上架 3:下架 0:所有
 */
export const STATUS_ALL = 0 // 所有
export const STATUS_NOT_SHELF = 1 // 未上架
export const STATUS_ALREADY_SHELF = 2 // 已上架
export const STATUS_OFF_SHELF = 3 // 下架

/**
 * 转码状态 1:转码中 2:转码完成 3:转码失败
 */

/**
  * chapter_type
  * 章节类型搜索
  * 1:单章节 2:多章节
  */
export const SINGLE_CHAPTER = 1
export const MULTIPLE_CHAPTERS = 2

/**
 * 添加步骤
 */
export const SCENES_ONE = 1 // 第一步
export const SCENES_TWO = 2 // 第二步
export const SCENES_THREE = 3 // 第三步

/**
 * 是否免费
 */
export const FREE = 1 // 免费
export const NOT_FREE = 2 // 不免费

/**
 * 价格标识
 */
export const NEWCOMER_EXCLUSIVE = 1 // 新人专享
export const SHOCK_PRICE = 2 // 惊爆价

/**
 *  分类列表 - 分类类型  -枚举
 *  字段 types 类型 []int
 * 	1:素材 2:课程 3:章节 4:小节 5:课程包
 *  6:素材-视频 7:素材-音频 8:素材-文章 9:素材-图片
 *  10:小节-视频 11:小节-音频 12:小节-文章 13:小节-图片
 */
export const MATERIAL = [1] // 素材
export const COURSE = [2] // 课程
export const CHAPTER = [3] // 章节
export const SECTION = [4] // 小节
export const COURSE_PACKAGE = [5] // 课程包

export const MATERIAL_VIDEO = [6] // 素材-视频
export const MATERIAL_AUDIO = [7] // 素材-音频
export const MATERIAL_ARTICLE = [8] // 素材-文章
export const MATERIAL_PICTURE = [9] // 素材-图片

export const SECTION_VIDEO = [10] // 小节-视频
export const SECTION_AUDIO = [11] // 小节-音频
export const SECTION_ARTICLE = [12] // 小节-文章
export const SECTION_PICTURE = [13] // 小节-图片

/**
 * 标签列表
 * 1:素材 2:课程 3:章节 4:小节 5:课程包
 * 6:素材-视频 7:素材-音频 8:素材-文章 9: 用户 10:素材-图片
 * 11:小节-视频 12:小节-音频 13:小节-文章 14:小节-图片
 */
export const TAG_MATERIAL = [1] // 素材
export const TAG_COURSE = [2] // 课程
export const TAG_CHAPTER = [3] // 章节
export const TAG_SECTION = [4] // 小节
export const TAG_COURSE_PACKAGE = [5] // 课程包
export const TAG_MATERIAL_VIDEO = [6] // 素材-视频
export const TAG_MATERIAL_AUDIO = [7] // 素材-音频
export const TAG_MATERIAL_ARTICLE = [8] // 素材-文章
export const TAG_MATERIAL_PICTURE = [10] // 素材-图片
export const TAG_USER = [9] // 用户

export const TAG_SECTION_VIDEO = [11] // 小节-视频
export const TAG_SECTION_AUDIO = [12] // 小节-音频
export const TAG_SECTION_ARTICLE = [13] // 小节-文章
export const TAG_SECTION_PICTURE = [14] // 小节-图片

/**
 * 分类添加
 * 1:素材 2:课程 3:章节 4:小节 5:课程包
 * 6:素材-视频 7:素材-音频 8:素材-文章 9:素材-图片
 * 10:小节-视频 11:小节-音频 12:小节-文章 13:小节-图片
 */
export const MATERIAL_ADD = 1 // 素材
export const COURSE_ADD = 2 // 课程
export const CHAPTER_ADD = 3 // 章节
export const SECTION_ADD = 4 // 小节
export const COURSE_PACKAGE_ADD = 5 // 课程包

export const MATERIAL_VIDEO_ADD = 6 // 素材-视频
export const MATERIAL_AUDIO_ADD = 7 // 素材-音频
export const MATERIAL_ARTICLE_ADD = 8 // 素材-文章
export const MATERIAL_PICTURE_ADD = 9 // 素材-图片

export const SECTION_VIDEO_ADD = 10 // 小节-视频
export const SECTION_AUDIO_ADD = 11 // 小节-音频
export const SECTION_ARTICLE_ADD = 12 // 小节-文章
export const SECTION_PICTURE_ADD = 13 // 小节-图片
// 获取时间戳
export const DATETIME = `${new Date().getTime()}`
