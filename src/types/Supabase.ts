export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          description: string
          event_date: string | null
          event_time: string | null
          id: string
          image_url: string | null
          location: string | null
          media_type: string | null
          published: boolean
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          description: string
          event_date?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          media_type?: string | null
          published?: boolean
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string
          event_date?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          media_type?: string | null
          published?: boolean
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          description: string
          end_date: string | null
          event_time: string | null
          icon: string | null
          id: string
          image_url: string | null
          location: string
          media_type: string
          published: boolean
          start_date: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          end_date?: string | null
          event_time?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          location: string
          media_type: string
          published?: boolean
          start_date?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          end_date?: string | null
          event_time?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          location?: string
          media_type?: string
          published?: boolean
          start_date?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      galleries: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          gallery_date: string | null
          id: string
          image_urls: string[]
          published: boolean
          section_id: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          gallery_date?: string | null
          id?: string
          image_urls: string[]
          published?: boolean
          section_id?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          gallery_date?: string | null
          id?: string
          image_urls?: string[]
          published?: boolean
          section_id?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "galleries_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "gallery_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_sections: {
        Row: {
          display_order: number
          id: string
          name: string
        }
        Insert: {
          display_order: number
          id?: string
          name: string
        }
        Update: {
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          created_at: string
          cta_link: string | null
          cta_text: string | null
          display_order: number | null
          id: string
          image_url: string
          published: boolean
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          published?: boolean
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          published?: boolean
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leaders: {
        Row: {
          bio: string | null
          contact: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string | null
          ministry: string | null
          name: string
          published: boolean
          role: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          contact?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          ministry?: string | null
          name: string
          published?: boolean
          role: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          contact?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          ministry?: string | null
          name?: string
          published?: boolean
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string
          description: string
          event: string
          id: string
          image_url: string
          year: string
        }
        Insert: {
          created_at?: string
          description: string
          event: string
          id?: string
          image_url: string
          year: string
        }
        Update: {
          created_at?: string
          description?: string
          event?: string
          id?: string
          image_url?: string
          year?: string
        }
        Relationships: []
      }
      ministries: {
        Row: {
          age_group: string | null
          created_at: string
          description: string
          display_order: number | null
          icon_name: string | null
          id: string
          image_url: string | null
          leader_name: string | null
          long_description: string | null
          published: boolean
          schedule: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_group?: string | null
          created_at?: string
          description: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          leader_name?: string | null
          long_description?: string | null
          published?: boolean
          schedule?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_group?: string | null
          created_at?: string
          description?: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          leader_name?: string | null
          long_description?: string | null
          published?: boolean
          schedule?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notice_board: {
        Row: {
          content: string | null
          created_at: string
          description: string
          display_order: number | null
          id: string
          image_url: string | null
          media_type: string | null
          media_url: string | null
          published: boolean
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          media_type?: string | null
          media_url?: string | null
          published?: boolean
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          media_type?: string | null
          media_url?: string | null
          published?: boolean
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      sermon_powerpoints: {
        Row: {
          id: string
          sermon_guid: string
          powerpoint_url: string
          created_at: string
        }
        Insert: {
          id?: string
          sermon_guid: string
          powerpoint_url: string
          created_at?: string
        }
        Update: {
          id?: string
          sermon_guid?: string
          powerpoint_url?: string
          created_at?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string
          date: string
          id: string
          preacher: string
          presentation_url: string | null
          published: boolean
          snapshot_url: string | null
          title: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          date: string
          id?: string
          preacher: string
          presentation_url?: string | null
          published?: boolean
          snapshot_url?: string | null
          title: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          date?: string
          id?: string
          preacher?: string
          presentation_url?: string | null
          published?: boolean
          snapshot_url?: string | null
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      welcome_section: {
        Row: {
          content: string
          created_at: string
          display_order: number | null
          id: string
          published: boolean
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          display_order?: number | null
          id?: string
          published?: boolean
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          display_order?: number | null
          id?: string
          published?: boolean
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
